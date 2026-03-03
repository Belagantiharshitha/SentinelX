from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AccountBase(BaseModel):
    account_number: str
    holder_name: str
    baseline_avg_transaction: float
    baseline_primary_device: Optional[str] = None
    baseline_primary_location: Optional[str] = None
    baseline_login_start_hour: int
    baseline_login_end_hour: int


class AccountResponse(AccountBase):
    id: int
    risk_score: float
    risk_level: str
    account_status: str
    updated_at: datetime

    class Config:
        from_attributes = True