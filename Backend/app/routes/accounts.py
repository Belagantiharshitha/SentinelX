from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database.db import get_db
from ..database import models
from ..schemas.account import AccountResponse, AccountBase

router = APIRouter()

@router.post("/", response_model=AccountResponse)
def create_account(account: AccountBase, db: Session = Depends(get_db)):

    new_account = models.Account(
        account_number=account.account_number,
        holder_name=account.holder_name,
        baseline_avg_transaction=account.baseline_avg_transaction,
        baseline_primary_device=account.baseline_primary_device,
        baseline_primary_location=account.baseline_primary_location,
        baseline_login_start_hour=account.baseline_login_start_hour,
        baseline_login_end_hour=account.baseline_login_end_hour,
        risk_score=0,
        risk_level="Safe",
        account_status="Active"
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return new_account


@router.get("/", response_model=List[AccountResponse])
def get_accounts(db: Session = Depends(get_db)):
    return db.query(models.Account).all()


@router.get("/{account_id}")
def get_account_details(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        return {"error": "Account not found"}
    
    events = db.query(models.Event).filter(models.Event.account_id == account_id).order_by(models.Event.timestamp.desc()).limit(10).all()
    incidents = db.query(models.Incident).filter(models.Incident.account_id == account_id).order_by(models.Incident.created_at.desc()).all()
    
    return {
        "account": account,
        "recent_events": events,
        "incident_history": incidents
    }

@router.post("/{account_id}/lockdown")
def lockdown_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        return {"error": "Account not found"}
    
    account.account_status = "Locked"
    
    # Also log a critical event for this lockdown
    from datetime import datetime
    new_event = models.Event(
        account_id=account_id,
        event_type="EMERGENCY_LOCKDOWN",
        severity="CRITICAL",
        location="SYSTEM_OS",
        ip_address="127.0.0.1",
        risk_contribution=50.0,
        description="Manual emergency lockdown triggered by administrator.",
        timestamp=datetime.now()
    )
    db.add(new_event)
    
    # Update risk score as well
    account.risk_score = min(300.0, account.risk_score + 50.0)
    if account.risk_score >= 180:
        account.risk_level = "High"
    if account.risk_score >= 240:
        account.risk_level = "Critical"
        
    db.commit()
    db.refresh(account)
    
    return {"status": "success", "message": f"Account {account.account_number} has been locked.", "account": account}
