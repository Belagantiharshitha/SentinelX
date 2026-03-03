from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..database.db import get_db
from ..database import models
from ..schemas.incident import IncidentResponse

router = APIRouter()


@router.get("/", response_model=List[IncidentResponse])
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(models.Incident).options(joinedload(models.Incident.account)).all()
    return incidents