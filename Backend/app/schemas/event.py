from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class EventBase(BaseModel):
    event_type: str
    ip_address: str
    device: str
    location: str
    transaction_amount: Optional[float] = None

class EventCreate(EventBase):
    account_id: int

class EventResponse(EventBase):
    id: int
    timestamp: datetime
    risk_contribution: float
    detected_attack_type: Optional[str] = None

    class Config:
        from_attributes = True

class RiskBreakdown(BaseModel):
    baseline_deviation: float
    attack_contribution: float

class RiskResponse(BaseModel):
    new_risk_score: float
    risk_level: str
    detected_attacks: List[str]
    risk_breakdown: RiskBreakdown
