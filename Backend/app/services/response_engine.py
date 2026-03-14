from sqlalchemy.orm import Session
from ..database import models
import datetime
from .ai_summary import generate_ai_incident_summary
from .email_service import send_threat_alert
import asyncio

async def process_automated_response(db: Session, account: models.Account, risk_results: dict, attack_results: dict, ml_explanation: list = None):
    risk_level = risk_results["risk_level"]
    action_taken = "none"

    # 1. Update Account Status based on risk level
    ml_score = risk_results.get("ml_fraud_score", 0.0)
    
    if ml_score > 0.9:
        account.account_status = "Locked"
        action_taken = "auto_mitigated_ml_lock"
    elif risk_level == "Safe":
        account.account_status = "Active"
        action_taken = "status_nominal"
    elif risk_level == "Medium":
        account.account_status = "Monitoring"
        action_taken = "monitoring_enabled"
    elif risk_level == "High":
        account.account_status = "Verification Required"
        action_taken = "verification_required"
    elif risk_level == "Critical":
        account.account_status = "Locked"
        action_taken = "account_locked"

    # 2. Create Incident for High/Critical risk OR if an attack was detected
    if risk_level in ["High", "Critical"] or attack_results.get("detected_attacks"):
        incident_info = {
            "account_id": account.id,
            "attack_type": ", ".join(attack_results["detected_attacks"]) if attack_results["detected_attacks"] else f"High Risk ({risk_level})",
            "severity": risk_level,
            "final_risk_score": risk_results["new_risk_score"],
            "action_taken": action_taken,
            "ml_fraud_score": risk_results.get("ml_fraud_score", 0.0),
            "ml_explanation": ", ".join(ml_explanation) if ml_explanation else None
        }
        
        # Generate AI Summary
        ai_summary = generate_ai_incident_summary(incident_info)
        
        new_incident = models.Incident(
            **incident_info,
            ai_summary=ai_summary,
            status="open",
            created_at=datetime.datetime.utcnow()
        )
        db.add(new_incident)
        
        # 3. Trigger Advanced Threat Alert
        asyncio.create_task(
            send_threat_alert(
                user_email=account.email,
                user_name=account.holder_name,
                attack_type=incident_info["attack_type"],
                severity=incident_info["severity"],
                summary=ai_summary
            )
        )
        
    return action_taken
