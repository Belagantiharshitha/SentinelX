import sqlite3

def migrate():
    conn = sqlite3.connect('sentinelx_v4.db')
    cursor = conn.cursor()
    
    # Check accounts columns
    cursor.execute("PRAGMA table_info(accounts)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if 'is_verified' not in columns:
        print("Adding is_verified to accounts")
        cursor.execute("ALTER TABLE accounts ADD COLUMN is_verified INTEGER DEFAULT 1")
        
    if 'password_reset_required' not in columns:
        print("Adding password_reset_required to accounts")
        cursor.execute("ALTER TABLE accounts ADD COLUMN password_reset_required INTEGER DEFAULT 0")
        
    # Check events columns
    cursor.execute("PRAGMA table_info(events)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if 'user_agent' not in columns:
        print("Adding user_agent to events")
        cursor.execute("ALTER TABLE events ADD COLUMN user_agent TEXT")
        
    if 'browser_fingerprint' not in columns:
        print("Adding browser_fingerprint to events")
        cursor.execute("ALTER TABLE events ADD COLUMN browser_fingerprint TEXT")
        
    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
