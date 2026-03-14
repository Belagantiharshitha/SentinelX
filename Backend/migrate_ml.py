import sqlite3

conn = sqlite3.connect('sentinelx.db')
cursor = conn.cursor()

# Add ml_fraud_score to events
try:
    cursor.execute('ALTER TABLE events ADD COLUMN ml_fraud_score FLOAT')
    print('Added ml_fraud_score to events')
except Exception as e:
    print(f'Column ml_fraud_score may already exist in events: {e}')

# Add ml_fraud_score to incidents
try:
    cursor.execute('ALTER TABLE incidents ADD COLUMN ml_fraud_score FLOAT')
    print('Added ml_fraud_score to incidents')
except Exception as e:
    print(f'Column ml_fraud_score may already exist in incidents: {e}')

conn.commit()
conn.close()
print('Migration complete!')
