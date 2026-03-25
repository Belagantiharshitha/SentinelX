import sqlite3
import pandas as pd
import os

def migrate_profile_data():
    db_path = 'sentinelx_v4.db'
    csv_path = '../updated_users_data.csv'
    
    if not os.path.exists(csv_path):
        print(f"CSV not found at {csv_path}")
        return

    # Load CSV
    # Head of CSV: id,current_age,retirement_age,birth_year,birth_month,gender,address,latitude,longitude,yearly_income,total_debt,credit_score,num_credit_cards,name
    df = pd.read_csv(csv_path)
    df['id'] = df['id'].astype(str)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add columns if they don't exist
    columns_to_add = [
        ('age', 'INTEGER'),
        ('gender', 'TEXT'),
        ('address', 'TEXT'),
        ('yearly_income', 'TEXT'),
        ('total_debt', 'TEXT'),
        ('credit_score', 'INTEGER'),
        ('num_credit_cards', 'INTEGER')
    ]
    
    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE accounts ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError:
            print(f"Column {col_name} already exists")

    # Update data
    cursor.execute("SELECT id, account_number FROM accounts")
    accounts = cursor.fetchall()
    
    updated_count = 0
    for db_id, acc_no in accounts:
        # acc_no is like 'ACC-825'
        search_id = acc_no.replace('ACC-', '')
        
        user_row = df[df['id'] == search_id]
        if not user_row.empty:
            row = user_row.iloc[0]
            cursor.execute("""
                UPDATE accounts SET 
                    age = ?, 
                    gender = ?, 
                    address = ?, 
                    yearly_income = ?, 
                    total_debt = ?, 
                    credit_score = ?, 
                    num_credit_cards = ?
                WHERE id = ?
            """, (
                int(row['current_age']),
                str(row['gender']),
                str(row['address']),
                str(row['yearly_income']),
                str(row['total_debt']),
                int(row['credit_score']),
                int(row['num_credit_cards']),
                db_id
            ))
            updated_count += 1
            
    conn.commit()
    conn.close()
    print(f"Successfully updated {updated_count} accounts with profile metadata.")

if __name__ == "__main__":
    migrate_profile_data()
