from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AccountBase(BaseModel):
    account_number: str
    holder_name: str
    email: str
    password: str
    baseline_avg_transaction: float
    baseline_primary_device: Optional[str] = None
    baseline_primary_location: Optional[str] = None
    baseline_login_start_hour: int
    baseline_login_end_hour: int


class AccountLogin(BaseModel):
    email: str
    password: str

class AccountResponse(AccountBase):
    id: int
    email: str
    risk_score: float
    risk_level: str
    account_status: str
    updated_at: datetime
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    yearly_income: Optional[str] = None
    total_debt: Optional[str] = None
    credit_score: Optional[int] = None
    num_credit_cards: Optional[int] = None
    is_verified: Optional[int] = 1
    password_reset_required: Optional[int] = 0

    class Config:
        from_attributes = True