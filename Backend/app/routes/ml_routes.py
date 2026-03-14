from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..services.ml_model import fraud_model

router = APIRouter()

@router.get("/status")
async def get_model_status():
    """Returns the current status of the ML model."""
    return fraud_model.get_status()

@router.post("/retrain")
async def trigger_retraining(db: Session = Depends(get_db)):
    """Manually triggers model retraining on all available events."""
    try:
        fraud_model.train(db)
        return {
            "status": "success",
            "message": f"Model retrained on {fraud_model.training_samples} samples.",
            "samples": fraud_model.training_samples
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

@router.get("/predictions/explain")
async def explain_latest_prediction():
    """Placeholder for advanced XAI explanations (future enhancement)."""
    return {"message": "XAI features are embedded in the event/incident reports."}
