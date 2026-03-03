import requests
import sys

def run_simulation(attack_type, account_id):
    url = f"http://localhost:8000/api/simulate/{attack_type}?account_id={account_id}"
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print(f"Successfully triggered {attack_type} for Account ID {account_id}")
            print("Response:", response.json())
        else:
            print(f"Failed to trigger {attack_type}. Status: {response.status_code}")
            print("Detail:", response.text)
    except Exception as e:
        print(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python manual_sim.py <attack_type> <account_id>")
        print("Types: credential-stuffing, brute-force, impossible-travel, account-takeover, transaction-anomaly")
        sys.exit(1)
    
    run_simulation(sys.argv[1], sys.argv[2])
