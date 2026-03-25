import requests
import json

try:
    url = "http://localhost:8000/api/simulate/impossible-travel?account_id=1"
    response = requests.post(url)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
