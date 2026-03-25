import sqlite3
import os

# Threshold constants (Synchronized with risk_engine.py)
THRESHOLD_SAFE = 100
THRESHOLD_MEDIUM = 160
THRESHOLD_HIGH = 220

def sync_accounts():
    db_path = r'C:\Users\sahit\OneDrive\Desktop\sentinel\SentinelX\Backend\sentinelx_v4.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Fetch all accounts
    cursor.execute("SELECT id, risk_score, account_status, risk_level FROM accounts")
    accounts = cursor.fetchall()
    
    updated_count = 0
    print(f"Syncing {len(accounts)} accounts...")

    for acc_id, score, current_status, current_level in accounts:
        # Determine Level from current score
        if score <= THRESHOLD_SAFE:
            new_level = "Safe"
        elif score <= THRESHOLD_MEDIUM:
            new_level = "Medium"
        elif score <= THRESHOLD_HIGH:
            new_level = "High"
        else:
            new_level = "Critical"

        # Determine Status from new level
        if new_level == "Safe":
            new_status = "Active"
        elif new_level == "Medium":
            new_status = "Monitoring"
        elif new_level == "High":
            new_status = "Verification Required"
        elif new_level == "Critical" or new_level == "Locked": # Catch Locked from history
            new_status = "Locked"
            
        if new_status != current_status or new_level != current_level:
            cursor.execute(
                "UPDATE accounts SET account_status = ?, risk_level = ? WHERE id = ?",
                (new_status, new_level, acc_id)
            )
            updated_count += 1
            if acc_id == 9:
                 print(f"Updated Acc {acc_id}: Score {score} -> Level {new_level}, Status {new_status}")

    conn.commit()
    conn.close()
    print(f"Sync complete. Updated {updated_count} accounts.")

if __name__ == "__main__":
    sync_accounts()
