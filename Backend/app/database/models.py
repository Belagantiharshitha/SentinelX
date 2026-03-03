from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Index, Text
from sqlalchemy.orm import relationship
from .db import Base
import datetime


# ❌ Remove Bank class completely for now
# We will simplify architecture to make backend stable


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    # 🔥 Removed bank_id and bank relationship

    account_number = Column(String, unique=True, index=True)
    holder_name = Column(String)

    # Baselines
    baseline_avg_transaction = Column(Float, default=0.0)
    baseline_primary_device = Column(String, nullable=True)
    baseline_primary_location = Column(String, nullable=True)
    baseline_login_start_hour = Column(Integer, default=0)
    baseline_login_end_hour = Column(Integer, default=23)

    # Risk Metrics
    reputation_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String, default="low")

    account_status = Column(String, default="active")
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
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
    transaction_amount = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    risk_contribution = Column(Float, default=0.0)
    detected_attack_type = Column(String, nullable=True)

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

    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    status = Column(String, default="open")

    account = relationship("Account", back_populates="incidents")


Index("ix_events_account_timestamp", Event.account_id, Event.timestamp)
Index("ix_incidents_account_created", Incident.account_id, Incident.created_at)