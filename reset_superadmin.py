from modules.db import superadmin_collection
import time

def reset_superadmin():
    try:
        print("Attempting to reset superadmin credentials...")
        # Force delete existing to ensure clean state
        superadmin_collection.delete_many({"username": "superadmin"})
        
        # Insert known credentials
        superadmin_collection.insert_one({
            "username": "superadmin",
            "password": "admin"
        })
        print("SUCCESS: Reset superadmin credentials to:")
        print("Username: superadmin")
        print("Password: admin")
        
        # Verify it exists
        user = superadmin_collection.find_one({"username": "superadmin"})
        print(f"Verification: Found user {user['username']}")
        
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    reset_superadmin()
