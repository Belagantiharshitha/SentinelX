from sqlalchemy.orm import Session
from ..database import models
import datetime
from .ai_summary import generate_ai_incident_summary

def process_automated_response(db: Session, account: models.Account, risk_results: dict, attack_results: dict):
    risk_level = risk_results["risk_level"]
    action_taken = "none"

    # 1. Update Account Status based on risk level
    if risk_level == "Medium":
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
            "attack_type": ", ".join(attack_results["detected_attacks"]) if attack_results["detected_attacks"] else "High Risk Score",
            "severity": risk_level,
            "final_risk_score": risk_results["new_risk_score"],
            "action_taken": action_taken,
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
        
    return action_taken
