import sqlite3
import pandas as pd
import os

# Try both locations
paths = [
    r"C:\Users\sahit\OneDrive\Desktop\sentinel\SentinelX\Backend\sentinelx_v4.db",
    r"C:\Users\sahit\OneDrive\Desktop\sentinel\SentinelX\sentinelx_v4.db"
]

db_path = ""
for p in paths:
    if os.path.exists(p):
        db_path = p
        break

def get_non_hyderabad_accounts():
    if not db_path:
        print("ERROR: Database not found!")
        return

    conn = sqlite3.connect(db_path)
    query = """
    SELECT id, account_number, holder_name, baseline_primary_location, baseline_primary_device, risk_level, account_status
    FROM accounts
    WHERE baseline_primary_location NOT LIKE '%Hyderabad%'
    LIMIT 15;
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    print("--- ACCOUNTS NOT IN HYDERABAD ---")
    print(df.to_string(index=False))

if __name__ == "__main__":
    get_non_hyderabad_accounts()
