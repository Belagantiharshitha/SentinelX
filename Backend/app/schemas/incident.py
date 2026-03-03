from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .account import AccountResponse

class IncidentBase(BaseModel):
    attack_type: str
    severity: str
    final_risk_score: float
    action_taken: str
    ai_summary: Optional[str]
    status: str

class IncidentResponse(IncidentBase):
    id: int
    account_id: int
    created_at: datetime
    account: Optional[AccountResponse]

    class Config:
        from_attributes = True
