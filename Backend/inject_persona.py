import sys
import os
from datetime import datetime, timedelta

# Pathing for imports
sys.path.append(os.getcwd())

from app.database.db import SessionLocal
from app.database import models

def inject_persona():
    db = SessionLocal()
    try:
        # Get target account 1116
        account = db.query(models.Account).filter(models.Account.account_number == 'ACC-1116').first()
        if not account:
            print("ERROR: Account 1116 not found.")
            return

        print(f"Injecting Secure Persona Cluster for {account.holder_name} (ACC-1116)...")
        now = datetime.utcnow()
        
        # 1. 10 Safe historical events (Logins and Transactions from 'Home' / 'iPhone')
        # We manually set ml_pca_x and ml_pca_y to cluster in a 'SAFE' zone (Bottom-Left)
        # We set ml_fraud_score to low values (0.01 - 0.1) for Green Color.
        
        for i in range(10):
            ts = now - timedelta(days=i, hours=2)
            new_event = models.Event(
                account_id=account.id,
                event_type="login_success" if i % 2 == 0 else "transaction",
                ip_address="192.168.1.5",
                device="iPhone",
                location="San Diego",
                transaction_amount=50.0 if i % 2 != 0 else 0.0,
                timestamp=ts,
                risk_contribution=0.0,
                ml_fraud_score=0.05,
                ml_explanation="Legitimate Persona Signature",
                ml_pca_x=-2.0 + (i * 0.05), # Cluster tightly in Bottom-Left
                ml_pca_y=-2.0 + (i * 0.05)
            )
            db.add(new_event)
        
        db.commit()
        print("SUCCESS: 10 'Green' baseline events injected. The Threat Map will now show a 'Secure Cluster'.")
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inject_persona()
