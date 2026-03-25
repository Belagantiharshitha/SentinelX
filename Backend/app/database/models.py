from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Index, Text
from sqlalchemy.orm import relationship
from .db import Base
import datetime
from datetime import timezone


# ❌ Remove Bank class completely for now
# We will simplify architecture to make backend stable


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    # 🔥 Removed bank_id and bank relationship

    account_number = Column(String, unique=True, index=True)
    holder_name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    # Baselines
    baseline_avg_transaction = Column(Float, default=0.0)
    baseline_primary_device = Column(String, nullable=True)
    baseline_primary_location = Column(String, nullable=True)
    baseline_login_start_hour = Column(Integer, default=0)
    baseline_login_end_hour = Column(Integer, default=23)

    # MFA (TOTP)
    totp_secret = Column(String, nullable=True)
    totp_enabled = Column(Integer, default=0) # SQLite uses 0/1 for False/True

    # Risk Metrics
    reputation_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String, default="low")

    # Profile Metadata (from dataset)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    address = Column(String, nullable=True)
    yearly_income = Column(String, nullable=True)
    total_debt = Column(String, nullable=True)
    credit_score = Column(Integer, nullable=True)
    num_credit_cards = Column(Integer, nullable=True)

    account_status = Column(String, default="active")
    
    # Remediation Workflow
    is_verified = Column(Integer, default=1)
    password_reset_required = Column(Integer, default=0)
    
    updated_at = Column(
        DateTime,
        default=lambda: datetime.datetime.utcnow(),
        onupdate=lambda: datetime.datetime.utcnow()
    )

    events = relationship("Event", back_populates="account")
    incidents = relationship("Incident", back_populates="account")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), index=True)

    event_type = Column(String, index=True)

    ip_address = Column(String)
    device = Column(String)
    location = Column(String)
    user_agent = Column(String, nullable=True)
    browser_fingerprint = Column(String, nullable=True)
    transaction_amount = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.utcnow(), index=True)

    risk_contribution = Column(Float, default=0.0)
    detected_attack_type = Column(String, nullable=True)
    ml_fraud_score = Column(Float, nullable=True)
    ml_explanation = Column(String, nullable=True)
    ml_pca_x = Column(Float, nullable=True)
    ml_pca_y = Column(Float, nullable=True)

    account = relationship("Account", back_populates="events")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), index=True)

    attack_type = Column(String)
    severity = Column(String)
    final_risk_score = Column(Float)
    action_taken = Column(String)
    ai_summary = Column(Text, nullable=True)
    ml_fraud_score = Column(Float, nullable=True)
    ml_explanation = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.datetime.utcnow(), index=True)
    status = Column(String, default="open")

    account = relationship("Account", back_populates="incidents")


class MockEmail(Base):
    __tablename__ = "mock_emails"

    id = Column(Integer, primary_key=True, index=True)
    to_email = Column(String, index=True)
    subject = Column(String)
    html_content = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.datetime.utcnow(), index=True)
    is_read = Column(Integer, default=0) # 0 for false, 1 for true


class DeviceAuthRequest(Base):
    __tablename__ = "device_auth_requests"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), index=True)
    device = Column(String)
    location = Column(String)
    token = Column(String, unique=True, index=True)
    status = Column(String, default="pending") # pending, approved, denied
    created_at = Column(DateTime, default=lambda: datetime.datetime.utcnow())
    expires_at = Column(DateTime)
    
    account = relationship("Account")

Index("ix_events_account_timestamp", Event.account_id, Event.timestamp)
Index("ix_incidents_account_created", Incident.account_id, Incident.created_at)