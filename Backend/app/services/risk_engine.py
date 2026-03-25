from datetime import datetime
from ..database.models import Account, Event

def calculate_baseline_deviation(account: Account, event_data: dict) -> float:
    risk_score = 0.0
    
    # 1. New device check
    if account.baseline_primary_device and event_data.get("device") != account.baseline_primary_device:
        risk_score += 15 # Reduced from 25
        
    # 2. New location check
    if account.baseline_primary_location and event_data.get("location") != account.baseline_primary_location:
        risk_score += 10 # Reduced from 20
        
    # 3. Time check (login hours)
    current_hour = datetime.utcnow().hour
    if not (account.baseline_login_start_hour <= current_hour <= account.baseline_login_end_hour):
        risk_score += 15
        
    # 4. Transaction amount check
    if event_data.get("event_type") == "transaction":
        amount = event_data.get("transaction_amount", 0)
        # Institutional "Trust Floor": Amounts under 1500 are considered low-risk 
        # regardless of history unless other flags trigger.
        if amount > 1500 and amount > (account.baseline_avg_transaction * 3):
            risk_score += 30
            
    return risk_score

def get_risk_level(score: float) -> str:
    if score <= 100: # Lowered from 120 for earlier warnings
        return "Safe"
    elif score <= 160:
        return "Medium"
    elif score <= 220:
        return "High"
    else:
        return "Critical"

def evaluate_risk(account: Account, event_data: dict, attack_contributions: float = 0.0, ml_fraud_score: float = 0.0) -> dict:
    baseline_score = calculate_baseline_deviation(account, event_data)
    
    # ML contribution to risk score
    ml_contribution = 0.0
    if ml_fraud_score > 0.9:
        ml_contribution = 80.0
    elif ml_fraud_score > 0.7:
        ml_contribution = 50.0
    elif ml_fraud_score > 0.5:
        ml_contribution = 30.0
    
    # Use dynamic base: 85.0 if DB has 0 (new account), otherwise use DB score
    current_reputation = account.reputation_score if (account.reputation_score and account.reputation_score > 0.1) else 85.0
    
    # Total = Base Reputation + Baseline + Attack + ML
    total_score = min(300.0, current_reputation + baseline_score + attack_contributions + ml_contribution)
    
    return {
        "new_risk_score": total_score,
        "risk_level": get_risk_level(total_score),
        "baseline_deviation": baseline_score,
        "attack_contribution": attack_contributions,
        "ml_fraud_score": ml_fraud_score,
        "ml_contribution": ml_contribution
    }
