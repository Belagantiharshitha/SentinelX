from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database import models
from ..schemas.event import EventCreate, RiskResponse, RiskBreakdown
from ..services.risk_engine import evaluate_risk
from ..services.attack_detection import detect_attacks
from ..services.response_engine import process_automated_response
from ..services.ml_model import fraud_model
from ..services.email_service import send_security_alert
from datetime import datetime
import asyncio

router = APIRouter()

@router.post("/", response_model=RiskResponse)
async def create_event(event_in: EventCreate, db: Session = Depends(get_db)):
    # 1. Fetch Account
    account = db.query(models.Account).filter(models.Account.id == event_in.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 1.5 Emit New Device Email Notification
    if event_in.event_type == "login_success":
        reported_device = event_in.device
        if reported_device and reported_device != account.baseline_primary_device:
            # Fire and forget the email task so it doesn't block the API response
            asyncio.create_task(
                send_security_alert(
                    user_email=account.email,
                    user_name=account.holder_name,
                    device=reported_device,
                    location=event_in.location or "Unknown",
                    timestamp=datetime.utcnow()
                )
            )

    # 2. Detect Attacks (Rule-based)
    attack_results = detect_attacks(db, account.id, event_in.dict())
    
    # 2.5 ML Fraud Prediction
    ml_prediction = fraud_model.predict(event_in.dict(), db=db, account=account)
    ml_fraud_score = ml_prediction["fraud_probability"]
    
    # 3. Evaluate Risk (Baseline + Attacks + ML)
    risk_results = evaluate_risk(account, event_in.dict(), attack_results["attack_contribution"], ml_fraud_score)
    
    # 4. Save Event
    new_event = models.Event(
        **event_in.dict(),
        risk_contribution=risk_results["new_risk_score"],
        detected_attack_type=", ".join(attack_results["detected_attacks"]),
        ml_fraud_score=ml_fraud_score,
        ml_explanation=", ".join(ml_prediction.get("explanation", [])),
        ml_pca_x=ml_prediction.get("pca", [0, 0])[0],
        ml_pca_y=ml_prediction.get("pca", [0, 0])[1]
    )
    db.add(new_event)
    
    # 5. Update Account Risk
    account.risk_score = risk_results["new_risk_score"]
    account.risk_level = risk_results["risk_level"]
    
    # 6. Trigger Automated Response
    action_taken = await process_automated_response(db, account, risk_results, attack_results, ml_prediction.get("explanation", []))
    
    db.commit()
    db.refresh(account)
    
    return {
        "new_risk_score": risk_results["new_risk_score"],
        "risk_level": risk_results["risk_level"],
        "account_status": account.account_status,
        "detected_attacks": attack_results["detected_attacks"],
        "action_taken": action_taken,
        "ml_fraud_score": ml_fraud_score,
        "ml_is_anomaly": ml_prediction["is_anomaly"],
        "risk_breakdown": {
            "baseline_deviation": risk_results["baseline_deviation"],
            "attack_contribution": risk_results["attack_contribution"],
            "ml_fraud_score": ml_fraud_score,
            "ml_contribution": risk_results.get("ml_contribution", 0.0)
        }
    }

@router.post("/feedback")
async def process_feedback(incident_id: int, is_correct: bool, db: Session = Depends(get_db)):
    """Receives feedback from analysts and prepares data for retraining."""
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident.status = "resolved" if is_correct else "false_positive"
    db.commit()
    
    # In a real system, we'd flag this event for the next training batch
    return {"message": "Feedback received, model will prioritize this pattern in next training cycle."}

@router.post("/train")
async def trigger_training(db: Session = Depends(get_db)):
    """Manually trigger model retraining on current dataset."""
    try:
        fraud_model.train(db)
        return {"status": "success", "samples": fraud_model.training_samples}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{account_id}")
async def get_events(account_id: int, db: Session = Depends(get_db)):
    events = db.query(models.Event).filter(models.Event.account_id == account_id).all()
    return events
