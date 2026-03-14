import requests
import json
import time

API_URL = "http://localhost:8000/api/events/"
ACCOUNT_ID = 1264 # Monica Hughes

def send_failed_login(attempt):
    payload = {
        "account_id": ACCOUNT_ID,
        "event_type": "login_failed",
        "ip_address": "192.168.1.45",
        "device": "Verification Script",
        "location": "San Francisco, CA",
        "transaction_amount": 0
    }
    print(f"Sending failed login attempt {attempt}...")
    response = requests.post(API_URL, json=payload)
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def verify():
    print("--- Starting Brute Force Verification ---")
    for i in range(1, 6):
        send_failed_login(i)
        time.sleep(1)
    
    print("\n--- Verification Complete ---")
    print("Please check the SentinelX Dashboard for a 'Brute Force' alert for account 1264.")

if __name__ == "__main__":
    verify()
