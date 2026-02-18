import requests
try:
    response = requests.get('http://127.0.0.1:5000/', timeout=5)
    print(f"Status Code: {response.status_code}")
    print("Server is reachable!")
except Exception as e:
    print(f"Failed to connect: {e}")
