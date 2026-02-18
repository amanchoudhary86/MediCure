import requests

url = 'http://127.0.0.1:5000/superadmin_login'
data = {'username': 'superadmin', 'password': 'admin'}

try:
    # Use a session to persist cookies
    session = requests.Session()
    response = session.post(url, data=data, allow_redirects=False)
    
    print(f"Status Code: {response.status_code}")
    print(f"Location Header: {response.headers.get('Location')}")
    
    if response.status_code == 302 and '/superadmin' in response.headers.get('Location', ''):
        print("LOGIN SUCCESSFUL! Redirected to dashboard.")
    else:
        print("LOGIN FAILED.")
        print(response.text)

except Exception as e:
    print(f"Error: {e}")
