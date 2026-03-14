from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database import models
from ..services.risk_engine import evaluate_risk
from ..services.attack_detection import detect_attacks
from ..services.response_engine import process_automated_response
from ..services.ml_model import fraud_model
from datetime import datetime, timedelta, timezone

router = APIRouter()

def run_simulation(db: Session, account_id: int, events: list):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    results = []
    final_attack_results = {"detected_attacks": [], "attack_contribution": 0}
    final_risk_results = {}
    max_ml_fraud_score = 0.0
    all_ml_explanations = []

    for event_data in events:
        # 1. Save Event First
        new_event = models.Event(
            **event_data,
            account_id=account.id,
            risk_contribution=0.0,
            detected_attack_type=""
        )
        db.add(new_event)
        db.flush()

        event_dict_with_id = {**event_data, "id": new_event.id}

        # 2. Detect Attacks (Rule-based)
        attack_results = detect_attacks(db, account.id, event_dict_with_id)
        # Aggregate for the final step
        for attack in attack_results["detected_attacks"]:
            if attack not in final_attack_results["detected_attacks"]:
                final_attack_results["detected_attacks"].append(attack)
        final_attack_results["attack_contribution"] = max(final_attack_results["attack_contribution"], attack_results["attack_contribution"])
        
        # 2.5 ML Fraud Prediction
        ml_prediction = fraud_model.predict(event_data, db=db, account=account)
        ml_score = ml_prediction["fraud_probability"]
        max_ml_fraud_score = max(max_ml_fraud_score, ml_score)
        if ml_prediction.get("explanation"):
            for exp in ml_prediction["explanation"]:
                if exp not in all_ml_explanations:
                    all_ml_explanations.append(exp)
        
        # 3. Evaluate Risk (Baseline + Attacks + ML)
        risk_results = evaluate_risk(account, event_data, attack_results["attack_contribution"], ml_score)
        final_risk_results = risk_results
        
        # 4. Update Event
        new_event.risk_contribution = risk_results["new_risk_score"]
        new_event.detected_attack_type = ", ".join(attack_results["detected_attacks"])
        new_event.ml_fraud_score = ml_score
        
        # 5. Update Account Risk
        account.risk_score = risk_results["new_risk_score"]
        account.risk_level = risk_results["risk_level"]
        
        results.append({
            "event": event_data["event_type"],
            "risk_score": risk_results["new_risk_score"],
            "risk_level": risk_results["risk_level"],
            "attacks": attack_results["detected_attacks"],
            "ml_fraud_score": ml_score,
            "ml_is_anomaly": ml_prediction["is_anomaly"]
        })
    
    # 6. Trigger ONE Automated Response at the end of simulation
    # Use the max ML score and collected explanations for the incident report
    final_risk_results["ml_fraud_score"] = max_ml_fraud_score
    action_taken = process_automated_response(db, account, final_risk_results, final_attack_results, ml_explanation=all_ml_explanations)
    
    db.commit()
    db.refresh(account)
    
    return {
        "account_id": account.id,
        "final_risk_score": account.risk_score,
        "final_risk_level": account.risk_level,
        "final_status": account.account_status,
        "detected_attacks": final_attack_results["detected_attacks"],
        "action_taken": action_taken,
        "ml_fraud_score": max_ml_fraud_score,
        "simulation_steps": results
    }


@router.post("/credential-stuffing")
async def simulate_credential_stuffing(account_id: int, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    events = [
        {"event_type": "login_failed", "ip_address": "1.1.1.1", "device": "unknown", "location": "USA", "timestamp": now - timedelta(minutes=1)},
        {"event_type": "login_failed", "ip_address": "1.1.1.1", "device": "unknown", "location": "USA", "timestamp": now - timedelta(seconds=30)},
        {"event_type": "login_failed", "ip_address": "1.1.1.1", "device": "unknown", "location": "USA", "timestamp": now}
    ]
    return run_simulation(db, account_id, events)

@router.post("/brute-force")
async def simulate_brute_force(account_id: int, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    events = []
    for i in range(6):
        events.append({"event_type": "login_failed", "ip_address": "2.2.2.2", "device": "unknown", "location": "UK", "timestamp": now - timedelta(seconds=(6-i)*10)})
    return run_simulation(db, account_id, events)

@router.post("/account-takeover")
async def simulate_account_takeover(account_id: int, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    events = [
        {"event_type": "login_failed", "ip_address": "3.3.3.3", "device": "new_tab", "location": "Russia", "timestamp": now - timedelta(minutes=10)},
        {"event_type": "login_failed", "ip_address": "3.3.3.3", "device": "new_tab", "location": "Russia", "timestamp": now - timedelta(minutes=9)},
        {"event_type": "login_success", "ip_address": "3.3.3.3", "device": "new_tab", "location": "Russia", "timestamp": now - timedelta(minutes=5)},
        {"event_type": "transaction", "ip_address": "3.3.3.3", "device": "new_tab", "location": "Russia", "transaction_amount": 2000, "timestamp": now}
    ]
    return run_simulation(db, account_id, events)

@router.post("/impossible-travel")
async def simulate_impossible_travel(account_id: int, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    events = [
        {"event_type": "login_success", "ip_address": "4.4.4.4", "device": "iPhone", "location": "New York", "timestamp": now - timedelta(minutes=10)},
        {"event_type": "transaction", "ip_address": "5.5.5.5", "device": "iPhone", "location": "Tokyo", "transaction_amount": 100, "timestamp": now}
    ]
    return run_simulation(db, account_id, events)

@router.post("/transaction-anomaly")
async def simulate_transaction_anomaly(account_id: int, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    events = [
        {"event_type": "transaction", "ip_address": "6.6.6.6", "device": "Chrome", "location": "Home", "transaction_amount": 10000, "timestamp": now}
    ]
    return run_simulation(db, account_id, events)

@router.post("/bank-corruption")
async def simulate_bank_corruption(account_id: int, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    # Corruption involves unauthorized status changes or data manipulation
    events = [
        {"event_type": "status_change", "ip_address": "internal-admin", "device": "Core-Server", "location": "Data Center", "timestamp": now}
    ]
    return run_simulation(db, account_id, events)
@router.post("/reset-account")
async def reset_account_security(account_number: str, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.account_number == account_number).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 1. Reset Account metrics
    account.risk_score = 0.0
    account.risk_level = "Safe"
    account.account_status = "Active"
    
    # 2. Delete associated alerts/incidents
    db.query(models.Incident).filter(models.Incident.account_id == account_id).delete()
    
    # 3. Optional: Delete events to clear the timeline completely for the demo
    db.query(models.Event).filter(models.Event.account_id == account_id).delete()
    
    db.commit()
    return {"status": "success", "message": f"Security status for {account.account_number} has been hard-reset."}
