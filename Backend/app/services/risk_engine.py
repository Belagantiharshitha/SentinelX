from datetime import datetime
from ..database.models import Account, Event

def calculate_baseline_deviation(account: Account, event_data: dict) -> float:
    risk_score = 0.0
    
    # 1. New device check
    if account.baseline_primary_device and event_data.get("device") != account.baseline_primary_device:
        risk_score += 25
        
    # 2. New location check
    if account.baseline_primary_location and event_data.get("location") != account.baseline_primary_location:
        risk_score += 20
        
    # 3. Time check (login hours)
    current_hour = datetime.utcnow().hour
    if not (account.baseline_login_start_hour <= current_hour <= account.baseline_login_end_hour):
        risk_score += 15
        
    # 4. Transaction amount check
    if event_data.get("event_type") == "transaction":
        amount = event_data.get("transaction_amount", 0)
        if amount > (account.baseline_avg_transaction * 3):
            risk_score += 30
            
    return risk_score

def get_risk_level(score: float) -> str:
    if score <= 90:
        return "Safe"
    elif score <= 180:
        return "Medium"
    elif score <= 240:
        return "High"
    else:
        return "Critical"

def evaluate_risk(account: Account, event_data: dict, attack_contributions: float = 0.0) -> dict:
    baseline_score = calculate_baseline_deviation(account, event_data)
    # Total = Initial Reputation (85) + Baseline + Attack
    total_score = min(300.0, account.reputation_score + baseline_score + attack_contributions)
    
    return {
        "new_risk_score": total_score,
        "risk_level": get_risk_level(total_score),
        "baseline_deviation": baseline_score,
        "attack_contribution": attack_contributions
    }
