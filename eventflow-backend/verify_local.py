import os
import django
from django.test import Client

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')
django.setup()

def run_verification():
    client = Client()
    print("=== Testing Registration ===")
    res = client.post('/api/auth/register', {
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password123',
        'role': 'user'
    }, content_type='application/json')
    print("Register Status:", res.status_code)
    print("Register Data:", res.json())

    print("\n=== Testing Login ===")
    res = client.post('/api/auth/login', {
        'email': 'testuser@example.com',
        'password': 'password123'
    }, content_type='application/json')
    print("Login Status:", res.status_code)
    data = res.json()
    print("Login Data (Token Present):", 'token' in data)
    token = data.get('token')

    print("\n=== Testing Admin Stats (Unauthorized) ===")
    res = client.get('/api/admin/stats', HTTP_AUTHORIZATION=f'Bearer {token}')
    print("Admin Stats Status:", res.status_code)

    print("\n=== Testing Profile Retrieval ===")
    res = client.get('/api/auth/profile', HTTP_AUTHORIZATION=f'Bearer {token}')
    print("Profile Status:", res.status_code)
    print("Profile Data:", res.json())

if __name__ == '__main__':
    run_verification()
