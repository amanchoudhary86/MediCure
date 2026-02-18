from modules.db import admin_collection
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

demo_users = [
    {"email": "ashwini@gmail.com", "password": "Ashwini2025", "hospital_name": "Ashwini Hospital"},
    {"email": "artemis@gmail.com", "password": "Artemis2025", "hospital_name": "Artemis Hospital"},
    {"email": "nicdelhi@gmail.com", "password": "Gunupur2025", "hospital_name": "NIC Delhi Hospital"}
]

def fix_admin_users():
    try:
        print("Checking and fixing admin demo users...")
        for user in demo_users:
            email = user['email']
            raw_password = user['password']
            hospital_name = user['hospital_name']
            
            # Delete existing to ensure clean state
            admin_collection.delete_many({"hospital_mail": email})
            
            # Hash password
            hashed_password = bcrypt.generate_password_hash(raw_password).decode('utf-8')
            
            # Insert new record
            admin_data = {
                "hospital_mail": email,
                "hospital_password": hashed_password,
                "hospital_name": hospital_name
            }
            admin_collection.insert_one(admin_data)
            print(f"Reset/Created user: {email} / {raw_password}")
            
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    fix_admin_users()
