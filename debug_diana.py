import sys
import os
# Ensure we can find the app module
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from app.database.db import SessionLocal
from app.database.models import Account, Event

def main():
    db = SessionLocal()
    try:
        acc = db.query(Account).filter(Account.id == 4).first()
        if not acc:
            print("DIANA_NOT_FOUND")
            return
        
        print(f"DIANA_HOLDER: {acc.holder_name}")
        print(f"DIANA_REPUTATION: {acc.reputation_score}")
        print(f"DIANA_SCORE: {acc.risk_score}")
        print(f"DIANA_BASELINE_LOC: {acc.baseline_primary_location}")
        print(f"DIANA_BASELINE_DEV: {acc.baseline_primary_device}")

        events = db.query(Event).filter(Event.account_id == 4).all()
        for e in events:
            print(f"EVENT: type={e.event_type}, risk={e.risk_contribution}, attack={e.detected_attack_type}, loc={e.location}, dev={e.device}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
