from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from ..database.models import Event, Account
from sqlalchemy import func

def detect_attacks(db: Session, account_id: int, current_event: dict) -> dict:
    detected_attacks = []
    total_contribution = 0.0
    now = current_event.get("timestamp")
    if now:
        # If string, parse it. If aware, make naive UTC.
        if isinstance(now, str):
            now = datetime.fromisoformat(now.replace("Z", "+00:00"))
        if now.tzinfo is not None:
             now = now.astimezone(timezone.utc).replace(tzinfo=None)
    else:
        now = datetime.utcnow()

    # 1. Credential Stuffing & Brute Force & Account Takeover overlap logic:
    # We should evaluate them from most complex/severe to least, to avoid overlap.
    
    # 1. Account Takeover (High severity)
    # Check if a transaction occurs shortly after a successful login that was preceded by failures
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
                Event.timestamp >= (recent_success_login.timestamp - timedelta(minutes=60))
            ).count()
            
            if prior_failures >= 3 and current_event.get("transaction_amount", 0) > 1000:
                detected_attacks.append("Account Takeover")
                total_contribution += 80
                is_takeover = True

    # 2. Brute Force (High frequency from same IP)
    is_brute_force = False
    one_min_ago = now - timedelta(seconds=65)
    ip_address = current_event.get("ip_address")
    if ip_address:
        ip_failed_logins = db.query(Event).filter(
            Event.event_type == "login_failed",
            Event.ip_address == ip_address,
            Event.timestamp >= one_min_ago
        ).count()
        if ip_failed_logins >= 5:
            detected_attacks.append("Brute Force")
            total_contribution += 40
            is_brute_force = True

    # 3. Credential Stuffing (Multiple attempts from different IPs on same account)
    if not is_brute_force:
        two_mins_ago = now - timedelta(seconds=125)
        failed_logins = db.query(Event).filter(
            Event.account_id == account_id,
            Event.event_type == "login_failed",
            Event.timestamp >= two_mins_ago
        ).count()
        
        if failed_logins >= 4:
            detected_attacks.append("Credential Stuffing")
            total_contribution += 35

    # 4. Impossible Travel
    last_valuable_event = db.query(Event).filter(
        Event.account_id == account_id,
        Event.id != current_event.get("id"),
        Event.event_type.in_(["login_success", "transaction", "status_change"])
    ).order_by(Event.timestamp.desc()).first()
    
    current_location = current_event.get("location")
    if last_valuable_event and last_valuable_event.location and current_location:
        if last_valuable_event.location != "Unknown" and current_location != "Unknown" and last_valuable_event.location != current_location:
            time_diff = (now - last_valuable_event.timestamp).total_seconds() / 60
            if time_diff < 30: # Increased from 15 for better demo reliability
                detected_attacks.append("Impossible Travel")
                total_contribution += 60 # Slightly increased

    # 5. Transaction Anomaly
    if current_event.get("event_type") == "transaction":
        amount = current_event.get("transaction_amount", 0)
        if amount > 5000:
            detected_attacks.append("Transaction Anomaly")
            total_contribution += 45

    # 6. Bank Corruption (Systemic Status Changes or Internal Data Inconsistency)
    if current_event.get("event_type") == "corruption_event" or current_event.get("event_type") == "status_change":
        detected_attacks.append("Bank Corruption")
        total_contribution += 150 # Critical systemic risk

    # 7. Browser Fingerprinting mismatch
    current_ua = current_event.get("user_agent")
    current_fingerprint = current_event.get("browser_fingerprint")
    if current_ua or current_fingerprint:
        last_good_browser_event = db.query(Event).filter(
            Event.account_id == account_id,
            Event.event_type.in_(["login_success", "transaction"]),
            Event.id != current_event.get("id")
        ).order_by(Event.timestamp.desc()).first()
        
        if last_good_browser_event:
            is_mismatch = False
            if current_ua and last_good_browser_event.user_agent and current_ua != last_good_browser_event.user_agent:
                is_mismatch = True
            if current_fingerprint and last_good_browser_event.browser_fingerprint and current_fingerprint != last_good_browser_event.browser_fingerprint:
                is_mismatch = True
            
            if is_mismatch:
                detected_attacks.append("Browser Fingerprint Mismatch")
                total_contribution += 30

    return {
        "detected_attacks": list(set(detected_attacks)),
        "attack_contribution": total_contribution
    }
