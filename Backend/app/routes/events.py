from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database import models
from ..schemas.event import EventCreate, RiskResponse, RiskBreakdown
from ..services.risk_engine import evaluate_risk
from ..services.attack_detection import detect_attacks
from ..services.response_engine import process_automated_response

router = APIRouter()

@router.post("/", response_model=RiskResponse)
async def create_event(event_in: EventCreate, db: Session = Depends(get_db)):
    # 1. Fetch Account
    account = db.query(models.Account).filter(models.Account.id == event_in.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Detect Attacks
    attack_results = detect_attacks(db, account.id, event_in.dict())
    
    # 3. Evaluate Risk (Baseline + Attacks)
    risk_results = evaluate_risk(account, event_in.dict(), attack_results["attack_contribution"])
    
    # 4. Save Event
    new_event = models.Event(
        **event_in.dict(),
        risk_contribution=risk_results["new_risk_score"],
        detected_attack_type=", ".join(attack_results["detected_attacks"])
    )
    db.add(new_event)
    
    # 5. Update Account Risk
    account.risk_score = risk_results["new_risk_score"]
    account.risk_level = risk_results["risk_level"]
    
    # 6. Trigger Automated Response
    action_taken = process_automated_response(db, account, risk_results, attack_results)
    
    db.commit()
    db.refresh(account)
    
    return {
        "new_risk_score": risk_results["new_risk_score"],
        "risk_level": risk_results["risk_level"],
        "detected_attacks": attack_results["detected_attacks"],
        "action_taken": action_taken,
        "risk_breakdown": {
            "baseline_deviation": risk_results["baseline_deviation"],
            "attack_contribution": risk_results["attack_contribution"]
        }
    }

@router.get("/{account_id}")
async def get_events(account_id: int, db: Session = Depends(get_db)):
    events = db.query(models.Event).filter(models.Event.account_id == account_id).all()
    return events
