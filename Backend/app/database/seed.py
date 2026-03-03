import csv
import random
import os
from sqlalchemy.orm import Session
from .models import Account

def seed_database(db: Session):
    existing_count = db.query(Account).count()
    if existing_count > 0:
        return

    csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "updated_users_data.csv")
    if not os.path.exists(csv_path):
        print(f"CSV file not found at {csv_path}")
        return

    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        # We'll take the first 100 accounts to keep the DB snappy, 
        # but the user said "random 10 on dashboard", so seeding many is fine.
        rows = list(reader)
        # Randomly sample if the dataset is huge, but 2000 is manageable.
        
        for row in rows:
            # Map CSV columns to Account model
            # id,current_age,retirement_age,birth_year,birth_month,gender,address,latitude,longitude,per_capita_income,yearly_income,total_debt,credit_score,num_credit_cards,username
            
            income = float(row.get('yearly_income', '50000').replace('$', '').replace(',', ''))
            credit_score = int(row.get('credit_score', '700'))
            
            # Derived risk
            initial_risk = max(0, min(300, ((850 - credit_score) / 10) * 3))
            if initial_risk < 90: risk_level = "Safe"
            elif initial_risk < 180: risk_level = "Medium"
            elif initial_risk < 240: risk_level = "High"
            else: risk_level = "Critical"

            account = Account(
                account_number=f"ACC-{row.get('id', random.randint(1000, 9999))}",
                holder_name=row.get('username', 'Unknown User'),
                baseline_avg_transaction=round(income / 500, 2), # Typical daily/weekly spend
                baseline_primary_device=random.choice(["iPhone 15", "Samsung S24", "MacBook Pro", "Windows PC", "iPad Air"]),
                baseline_primary_location=row.get('address', 'Unknown City'),
                baseline_login_start_hour=random.randint(6, 10),
                baseline_login_end_hour=random.randint(19, 23),
                reputation_score=initial_risk,
                risk_score=initial_risk,
                risk_level=risk_level,
                account_status="Active"
            )
            db.add(account)
    
    db.commit()

