from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database.db import get_db
from ..database import models
from ..services.health_monitor import health_monitor

router = APIRouter()

@router.get("/overview")
async def get_dashboard_overview(db: Session = Depends(get_db)):
    # 1. Account Stats
    total_accounts = db.query(models.Account).count()
    high_risk_accounts = db.query(models.Account).filter(models.Account.risk_level.in_(["High", "Critical"])).count()
    locked_accounts = db.query(models.Account).filter(models.Account.account_status == "Locked").count()

    # 2. Risk Distribution
    risk_dist = db.query(models.Account.risk_level, func.count(models.Account.id)).group_by(models.Account.risk_level).all()
    risk_distribution = {level: count for level, count in risk_dist}

    # 3. Recent Activity
    recent_events = db.query(models.Event).order_by(models.Event.timestamp.desc()).limit(5).all()
    recent_incidents = db.query(models.Incident).order_by(models.Incident.created_at.desc()).limit(5).all()

    # 4. Random 10 Accounts for Dashboard Display
    # Using func.random() for SQLite/Postgres. For SQL Server it would be NEWID()
    random_accounts = db.query(models.Account).order_by(func.random()).limit(10).all()

    return {
        "total_accounts": total_accounts,
        "high_risk_accounts": high_risk_accounts,
        "locked_accounts": locked_accounts,
        "risk_distribution": risk_distribution,
        "recent_events": recent_events,
        "recent_incidents": recent_incidents,
        "random_accounts": random_accounts,
        "system_health": health_monitor.get_system_health()
    }

