import requests
import json
import time
from datetime import datetime, timedelta

API_URL = "http://localhost:8000/api/events/"
ACCOUNT_ID = 1264 # Monica Hughes

def send_event(event_type, details=None):
    payload = {
        "account_id": ACCOUNT_ID,
        "event_type": event_type,
        "ip_address": "192.168.1.100",
        "device": "Verification Script v2",
        "location": "San Francisco, CA",
        "timestamp": datetime.utcnow().isoformat()
    }
    if details:
        payload.update(details)
    
    print(f"Sending {event_type}...")
    response = requests.post(API_URL, json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"   Status: {data.get('account_status')} | Attacks: {data.get('detected_attacks')}")
        return data
    else:
        print(f"   Error: {response.status_code} - {response.text}")
        return None

def test_impossible_travel():
    print("\n--- Testing Impossible Travel ---")
    send_event("login_success", {"location": "San Francisco, CA"})
    time.sleep(1)
    send_event("transaction", {"location": "London, UK", "transaction_amount": 100})

def test_account_takeover():
    print("\n--- Testing Account Takeover ---")
    for _ in range(3):
        send_event("login_failed")
    send_event("login_success")
    send_event("transaction", {"transaction_amount": 1500})

def test_transaction_anomaly():
    print("\n--- Testing Transaction Anomaly ---")
    send_event("transaction", {"transaction_amount": 6000})

def test_bank_corruption():
    print("\n--- Testing Bank Corruption ---")
    send_event("corruption_event")

if __name__ == "__main__":
    print("WARNING: This will likely lock account 1264 in the database.")
    test_impossible_travel()
    test_transaction_anomaly()
    test_account_takeover()
    test_bank_corruption()
    print("\nVerification sequence finished.")
