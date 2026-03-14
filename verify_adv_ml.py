
import json
import urllib.request
import time

BASE_URL = "http://localhost:8000/api"

def make_request(url, method="GET", data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(data).encode('utf-8')
    
    try:
        with urllib.request.urlopen(req, data=data) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_fraud_detection():
    print("--- 0. Checking for accounts ---")
    accounts = make_request(f"{BASE_URL}/accounts/")
    if not accounts:
        print("No accounts found. Seeding or manual creation needed.")
        return
    
    account_id = accounts[0]['id']
    print(f"Using Account ID: {account_id} ({accounts[0]['holder_name']})")

    print("\n--- 1. Triggering Normal Activity ---")
    payload = {
        "account_id": account_id,
        "event_type": "transaction",
        "ip_address": "192.168.1.100",
        "device": accounts[0].get('baseline_primary_device') or "MyPhone",
        "location": accounts[0].get('baseline_primary_location') or "New York",
        "transaction_amount": 100.0
    }
    res = make_request(f"{BASE_URL}/events/", method="POST", data=payload)
    if res:
        print(f"Normal Activity Result: ML Score={res.get('ml_fraud_score')}")

    print("\n--- 2. Triggering Anomaly (High Amount + New Device + Night Time) ---")
    anomaly_payload = {
        "account_id": account_id,
        "event_type": "transaction",
        "ip_address": "45.67.89.12",
        "device": "Unknown HackBox",
        "location": "Moscow",
        "transaction_amount": 9000.0,
        "timestamp": "2026-03-11T03:00:00Z" 
    }
    res = make_request(f"{BASE_URL}/events/", method="POST", data=anomaly_payload)
    if res:
        print(f"Anomaly Fraud Score: {res.get('ml_fraud_score')}")
        print(f"Explanation: {res.get('ml_explanation')}")
        print(f"Risk Level: {res.get('risk_level')}")
        print(f"Action Taken: {res.get('action_taken')}")

    print("\n--- 3. Testing Administrative Retraining ---")
    res = make_request(f"{BASE_URL}/ml/retrain", method="POST")
    if res:
        print(f"Training Result: {res.get('message')}")

if __name__ == "__main__":
    test_fraud_detection()
