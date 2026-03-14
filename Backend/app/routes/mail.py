from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database import models
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class MockEmailResponse(BaseModel):
    id: int
    subject: str
    html_content: str
    created_at: datetime
    is_read: bool

    class Config:
        orm_mode = True

@router.get("/{email}", response_model=list[MockEmailResponse])
def get_mailbox(email: str, db: Session = Depends(get_db)):
    """Fetch all mock emails for a specific email address, ordered newest first."""
    emails = db.query(models.MockEmail)\
        .filter(models.MockEmail.to_email == email)\
        .order_by(models.MockEmail.created_at.desc())\
        .all()
    
    # Optional: Mark as read when fetched for a more realistic feel
    for e in emails:
        e.is_read = 1
    db.commit()
    
    # Convert 'is_read' from int (SQLite) to bool for response
    results = []
    for e in emails:
        results.append({
            "id": e.id,
            "subject": e.subject,
            "html_content": e.html_content,
            "created_at": e.created_at,
            "is_read": bool(e.is_read)
        })
    return results

@router.delete("/{email}")
def clear_mailbox(email: str, db: Session = Depends(get_db)):
    """Clear all mock emails for a specific email address (useful for testing)."""
    db.query(models.MockEmail)\
        .filter(models.MockEmail.to_email == email)\
        .delete()
    db.commit()
    return {"status": "success", "message": f"Mailbox cleared for {email}"}
