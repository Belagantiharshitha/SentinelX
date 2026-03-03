import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from app.database.db import SessionLocal
from app.database.models import Account

def check_db():
    db = SessionLocal()
    try:
        count = db.query(Account).count()
        print(f"DATABASE_ACCOUNT_COUNT: {count}")
        if count > 0:
            first = db.query(Account).first()
            print(f"FIRST_ACCOUNT: {first.holder_name} (ID: {first.id}, Score: {first.risk_score}, Rep: {getattr(first, 'reputation_score', 'MISSING')})")
    except Exception as e:
        print(f"DATABASE_ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
