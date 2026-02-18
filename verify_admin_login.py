import requests

url = 'http://127.0.0.1:5000/admin_login'
credentials_to_test = [
    {'username': 'ashwini@gmail.com', 'password': 'Ashwini2025'},
    {'username': 'artemis@gmail.com', 'password': 'Artemis2025'},
    {'username': 'nicdelhi@gmail.com', 'password': 'Gunupur2025'}
]

try:
    session = requests.Session()
    for creds in credentials_to_test:
        print(f"Testing login for: {creds['username']}")
        response = session.post(url, data=creds, allow_redirects=False)
        
        print(f"Status Code: {response.status_code}")
        location = response.headers.get('Location', '')
        print(f"Location Header: {location}")
        
        if response.status_code == 302 and '/admin' in location:
            print("LOGIN SUCCESSFUL!")
        else:
            print("LOGIN FAILED.")
            print(response.text[:200]) # Print first 200 chars of response
        print("-" * 20)

except Exception as e:
    print(f"Error: {e}")
