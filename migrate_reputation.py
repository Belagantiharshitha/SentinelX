import sys
import os
import sqlite3

# Path to the database
db_path = os.path.join(os.getcwd(), 'Backend', 'sentinelx.db')

if not os.path.exists(db_path):
    # Try alternate path if called from different CWD
    db_path = os.path.join(os.getcwd(), 'sentinelx.db')

def migrate():
    print(f"Connecting to database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Add column
        print("Adding column 'reputation_score' to 'accounts' table...")
        cursor.execute("ALTER TABLE accounts ADD COLUMN reputation_score FLOAT DEFAULT 0.0;")
        print("Column added successfully.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column 'reputation_score' already exists.")
        else:
            print(f"Error adding column: {e}")
    
    # 2. Sync scores
    print("Syncing 'reputation_score' with 'risk_score' for existing accounts...")
    cursor.execute("UPDATE accounts SET reputation_score = risk_score WHERE reputation_score = 0.0 AND risk_score > 0.0;")
    print(f"Rows updated: {cursor.rowcount}")
    
    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
