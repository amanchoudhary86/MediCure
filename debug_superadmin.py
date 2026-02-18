from modules.db import superadmin_collection
import pymongo

try:
    print("Checking Superadmin collection...")
    users = list(superadmin_collection.find())
    
    if not users:
        print("No superadmin users found!")
        print("Creating default superadmin user...")
        superadmin_collection.insert_one({
            "username": "superadmin",
            "password": "admin"
        })
        print("Created user: superadmin / admin")
    else:
        print("Existing superadmin users:")
        for user in users:
            print(f"Username: {user.get('username')}, Password: {user.get('password')}")

except Exception as e:
    print(f"An error occurred: {e}")
