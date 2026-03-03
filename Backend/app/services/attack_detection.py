from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..database.models import Event, Account
from sqlalchemy import func

def detect_attacks(db: Session, account_id: int, current_event: dict) -> dict:
    detected_attacks = []
    total_contribution = 0.0
    now = current_event.get("timestamp", datetime.utcnow())

    # 1. Credential Stuffing & Brute Force & Account Takeover overlap logic:
    # We should evaluate them from most complex/severe to least, to avoid overlap.
    
    # Check Account Takeover first
    is_takeover = False
    if current_event.get("event_type") == "transaction":
        recent_success_login = db.query(Event).filter(
            Event.account_id == account_id,
            Event.event_type == "login_success",
            Event.timestamp >= (now - timedelta(hours=1))
        ).order_by(Event.timestamp.desc()).first()
        
        if recent_success_login:
            prior_failures = db.query(Event).filter(
                Event.account_id == account_id,
                Event.event_type == "login_failed",
                Event.timestamp < recent_success_login.timestamp,
                Event.timestamp >= (recent_success_login.timestamp - timedelta(minutes=30))
            ).count()
            
            if prior_failures >= 2 and current_event.get("transaction_amount", 0) > 1000:
                detected_attacks.append("Account Takeover")
                total_contribution += 40
                is_takeover = True

    # Check Brute Force (High frequency from same IP)
    is_brute_force = False
    one_min_ago = now - timedelta(seconds=65)
    ip_address = current_event.get("ip_address")
    if ip_address:
        ip_failed_logins = db.query(Event).filter(
            Event.event_type == "login_failed",
            Event.ip_address == ip_address,
            Event.timestamp >= one_min_ago
        ).count()
        if ip_failed_logins >= 6:
            detected_attacks.append("Brute Force")
            total_contribution += 30
            is_brute_force = True

    # Check Credential Stuffing (Multiple attempts on SAME account)
    # Only if NOT a brute force to avoid double tagging the same sequence
    if not is_brute_force:
        two_mins_ago = now - timedelta(seconds=125)
        failed_logins = db.query(Event).filter(
            Event.account_id == account_id,
            Event.event_type == "login_failed",
            Event.timestamp >= two_mins_ago
        ).count()
        
        if failed_logins >= 3:
            detected_attacks.append("Credential Stuffing")
            total_contribution += 25

    # 4. Impossible Travel
    # fetch the last event that is NOT the current event (which was just inserted)
    last_event = db.query(Event).filter(
        Event.account_id == account_id,
        Event.id != current_event.get("id"),
        Event.event_type.in_(["login_success", "transaction", "status_change"])
    ).order_by(Event.timestamp.desc()).first()
    
    current_location = current_event.get("location")
    if last_event and last_event.location and current_location:
        if last_event.location != "Unknown" and current_location != "Unknown" and last_event.location != current_location:
            time_diff = (now - last_event.timestamp).total_seconds() / 60
            if time_diff < 30: # Simplified travel check: different location within 30 mins
                detected_attacks.append("Impossible Travel")
                total_contribution += 35

    # 5. Transaction Anomaly
    if current_event.get("event_type") == "transaction" and current_event.get("transaction_amount", 0) > 5000:
        detected_attacks.append("Transaction Anomaly")
        total_contribution += 25

    # 6. Bank Corruption (Systemic Status Changes or Internal Data Inconsistency)
    if current_event.get("event_type") == "status_change":
        # Check if status was changed to 'locked' or 'flagged' without typical prior flags
        detected_attacks.append("Bank Corruption")
        total_contribution += 100 # Instant critical

    return {
        "detected_attacks": list(set(detected_attacks)),
        "attack_contribution": total_contribution
    }
