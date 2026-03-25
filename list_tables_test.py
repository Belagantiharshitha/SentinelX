import sqlite3
import os

dbs = ['sentinelx_v4.db', 'Backend/sentinelx_v4.db']
for db_path in dbs:
    if os.path.exists(db_path):
        print(f"Checking {db_path}...")
        conn = sqlite3.connect(db_path)
        tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        print(f"Tables: {tables}")
        conn.close()
    else:
        print(f"File not found: {db_path}")
