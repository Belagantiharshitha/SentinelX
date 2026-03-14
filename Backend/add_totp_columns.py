import sqlite3

def add_totp_columns():
    db_path = "sentinelx_v4.db"
    print(f"Adding TOTP columns to {db_path}...")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE accounts ADD COLUMN totp_secret VARCHAR;")
        print("✅ Added 'totp_secret' column.")
    except sqlite3.OperationalError as e:
        print(f"⚠️ Could not add 'totp_secret': {e}")
        
    try:
        cursor.execute("ALTER TABLE accounts ADD COLUMN totp_enabled INTEGER DEFAULT 0;")
        print("✅ Added 'totp_enabled' column.")
    except sqlite3.OperationalError as e:
        print(f"⚠️ Could not add 'totp_enabled': {e}")

    conn.commit()
    conn.close()
    print("Database update complete.")

if __name__ == "__main__":
    add_totp_columns()
