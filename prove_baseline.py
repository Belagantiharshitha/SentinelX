import sys
import os

# Add Backend to path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(script_dir, 'Backend')
sys.path.append(backend_path)

# Point SQLAlchemy to use the DB in the Backend folder
os.environ["DATABASE_URL"] = f"sqlite:///{os.path.join(backend_path, 'sentinelx_v4.db')}"

from app.database.db import SessionLocal
from app.database.models import Account

def prove_baseline(search_term=None):
    db = SessionLocal()
    try:
        print("--- SENTINELX BASELINE SEARCH ---")
        
        if search_term:
            # Flexible Search: ID, Holder Name, or Account Number
            account = None
            if search_term.isdigit():
                # Try ID first
                account = db.query(Account).filter(Account.id == int(search_term)).first()
            
            # If not found by ID, or search was text, try Account Number or Name
            if not account:
                account = db.query(Account).filter(
                    (Account.account_number.ilike(f"%{search_term}%")) | 
                    (Account.holder_name.ilike(f"%{search_term}%"))
                ).first()
                
            if account:
                print(f"\nBASELINES FOR: {account.holder_name} (ID: {account.id})")
                print("-" * 50)
                print(f"Account Number:     {account.account_number}")
                print(f"Email:              {account.email}")
                print(f"Baseline Location:  {account.baseline_primary_location}")
                print(f"Baseline Device:    {account.baseline_primary_device}")
                print(f"Baseline Avg $:     ${account.baseline_avg_transaction}")
                print(f"Login Start Hour:   {account.baseline_login_start_hour}:00")
                print(f"Login End Hour:     {account.baseline_login_end_hour}:00")
                print(f"Risk Level:         {account.risk_level.upper()}")
                print(f"Account Status:     {account.account_status.upper()}")
                print("-" * 50)
            else:
                print(f"No account found matching '{search_term}'")
        else:
            count = db.query(Account).count()
            print(f"Total Accounts in Database: {count}")
            # Show all if count is small, else top 250
            accounts = db.query(Account).limit(250).all()
            print("\nBASELINE REPOSITORY (All Accounts):")
            print(f"{'ID':<4} | {'Acc Number':<12} | {'Holder Name':<20} | {'Status':<12} | {'Location'}")
            print("-" * 75)
            for acc in accounts:
                print(f"{acc.id:<4} | {acc.account_number:<12} | {acc.holder_name:<20} | {acc.account_status.upper():<12} | {acc.baseline_primary_location}")
            print("\nTIP: Run 'python prove_baseline.py <name_or_id>' to see specific details.")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    search = sys.argv[1] if len(sys.argv) > 1 else None
    prove_baseline(search)
