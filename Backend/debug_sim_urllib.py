import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'http://localhost:8000/api/simulate/impossible-travel?account_id=1'
req = urllib.request.Request(url, method='POST')

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print(f"Status: {response.getcode()}")
        print(f"Body: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Body: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
