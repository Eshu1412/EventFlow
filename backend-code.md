# Folder Structure: eventflow-backend

```
eventflow-backend/
├── .env
├── api
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── create_test_users.py
├── db.sqlite3
├── eventflow_backend
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── requirements.txt
├── static
│   └── admin
│       └── css
│           └── eventflow_theme.css
├── templates
│   └── admin
│       └── base_site.html
└── verify_local.py
```

# Files Content

## .env

```text
SECRET_KEY=django-insecure-3ub3=t(+t(sv05)o=i$e6@4-s=y(9$8(#$2$z(p(7%m%-_!q%s
DEBUG=True
ALLOWED_HOSTS=*
CORS_ALLOW_ALL_ORIGINS=True

# TURSO CONFIGURATION (commented out for local dev - libsql_client is incompatible with Python 3.14)
# TURSO_DB_URL=libsql://eventflow-eshu1412.aws-ap-south-1.turso.io
# TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2NzA1MDksImlkIjoiMDE5ZGE5ZDAtNjYwMS03ZGY1LWJjZDYtMzVmZjc5M2VkYTg0IiwicmlkIjoiODk2NmUzZGEtOThjMS00MTk4LWJhM2YtMWIxZWZjYWY0MjE4In0.A2xKblRSUc2N_pzm1APH693S5HjE50D7-9XfgwMeNtr-y3DAcybyQbT6xQNjq_mTEfhi4K1xqA39FF0N1DnqAQ
```

## create_test_users.py

```py
"""
Run with:  python create_test_users.py
(Must be executed from inside the eventflow-backend directory
 with the virtual-environment active, so Django settings load.)
"""
import os
import sys
import django

# ── bootstrap Django ────────────────────────────────────────────────────────
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eventflow_backend.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from api.models import User

# ── test-user definitions ───────────────────────────────────────────────────
TEST_USERS = [
    # ── Regular Users ──────────────────────────────────────────────────────
    {"name": "Alice Johnson",   "email": "alice@eventflow.test",   "password": "Alice@1234",   "role": "user"},
    {"name": "Bob Sharma",      "email": "bob@eventflow.test",     "password": "Bob@1234",     "role": "user"},
    {"name": "Clara Mendes",    "email": "clara@eventflow.test",   "password": "Clara@1234",   "role": "user"},
    # ── Organizers ─────────────────────────────────────────────────────────
    {"name": "Dev Patel",       "email": "dev@eventflow.test",     "password": "Dev@1234",     "role": "organizer"},
    {"name": "Eva Chen",        "email": "eva@eventflow.test",     "password": "Eva@1234",     "role": "organizer"},
    {"name": "Felix Ramos",     "email": "felix@eventflow.test",   "password": "Felix@1234",   "role": "organizer"},
    # ── Admins ─────────────────────────────────────────────────────────────
    {"name": "Grace Kim",       "email": "grace@eventflow.test",   "password": "Grace@1234",   "role": "admin"},
    {"name": "Hiro Tanaka",     "email": "hiro@eventflow.test",    "password": "Hiro@1234",    "role": "admin"},
    {"name": "Tushar Maurya",   "email": "tushar@eventflow.test",  "password": "Tushar@1234",  "role": "admin"},
]

created, skipped = [], []

for u in TEST_USERS:
    if User.objects.filter(email=u["email"]).exists():
        skipped.append(u["email"])
        continue
    User.objects.create(
        username=u["email"],          # Django requires unique username
        email=u["email"],
        name=u["name"],
        password=make_password(u["password"]),
        role=u["role"],
        is_staff=(u["role"] == "admin"),
        is_superuser=(u["role"] == "admin"),
    )
    created.append(u["email"])

print(f"\n[OK]     Created : {len(created)} user(s): {created}")
print(f"[SKIP]  Skipped : {len(skipped)} already exist: {skipped}")
print("\nDone - all test users are ready.\n")
```

## manage.py

```py
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
```

## requirements.txt

```txt
aiohappyeyeballs==2.6.1
aiohttp==3.13.5
aiosignal==1.4.0
alabaster==1.0.0
asgiref==3.11.1
attrs==26.1.0
babel==2.18.0
certifi==2026.2.25
cffi==2.0.0
charset-normalizer==3.4.7
colorama==0.4.6
cryptography==46.0.7
dj-database-url==3.1.2
Django==6.0.4
django-cors-headers==4.9.0
django-libsql==0.1.3
djangorestframework==3.17.1
djangorestframework_simplejwt==5.5.1
docutils==0.22.4
ecdsa==0.19.2
frozenlist==1.8.0
idna==3.11
imagesize==2.0.0
Jinja2==3.1.6
libsql-client==0.3.1
MarkupSafe==3.0.3
multidict==6.7.1
packaging==26.1
propcache==0.4.1
psycopg2-binary==2.9.11
pyasn1==0.6.3
pycparser==3.0
Pygments==2.20.0
PyJWT==2.12.1
python-dotenv==1.2.2
python-jose==3.5.0
requests==2.33.1
roman-numerals==4.1.0
rsa==4.9.1
six==1.17.0
snowballstemmer==3.0.1
Sphinx==9.1.0
sphinx-press-theme==0.8.0
sphinxcontrib-applehelp==2.0.0
sphinxcontrib-devhelp==2.0.0
sphinxcontrib-htmlhelp==2.1.0
sphinxcontrib-jsmath==1.0.1
sphinxcontrib-qthelp==2.0.0
sphinxcontrib-serializinghtml==2.0.0
sqlparse==0.5.5
typing_extensions==4.15.0
tzdata==2026.1
urllib3==2.6.3
yarl==1.23.0
```

## verify_local.py

```py
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
```

## api\admin.py

```py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Event, Booking

# ── Admin site branding ──────────────────────────────────────────────────────
admin.site.site_header  = "EventFlow Administration"
admin.site.site_title   = "EventFlow Admin"
admin.site.index_title  = "Platform Dashboard"


# ── User ─────────────────────────────────────────────────────────────────────
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ("username", "email", "name", "role", "is_active", "date_joined")
    list_filter   = ("role", "is_active", "is_staff")
    search_fields = ("username", "email", "name")
    ordering      = ("-date_joined",)
    list_per_page = 25

    fieldsets = BaseUserAdmin.fieldsets + (
        ("EventFlow Profile", {"fields": ("name", "role")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("EventFlow Profile", {"fields": ("name", "role")}),
    )


# ── Event ─────────────────────────────────────────────────────────────────────
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display  = ("title", "category", "organizer", "date", "price",
                     "total_seats", "booked_seats", "available_seats_display")
    list_filter   = ("category", "date")
    search_fields = ("title", "location", "organizer__username")
    ordering      = ("-date",)
    list_per_page = 25
    date_hierarchy = "date"
    readonly_fields = ("booked_seats", "created_at")

    fieldsets = (
        ("Event Details", {
            "fields": ("title", "description", "category", "image_url")
        }),
        ("Location & Timing", {
            "fields": ("location", "date")
        }),
        ("Capacity & Pricing", {
            "fields": ("total_seats", "booked_seats", "price")
        }),
        ("Organizer", {
            "fields": ("organizer", "created_at")
        }),
    )

    @admin.display(description="Available Seats")
    def available_seats_display(self, obj):
        return obj.available_seats


# ── Booking ───────────────────────────────────────────────────────────────────
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display  = ("id", "user", "event", "status", "booked_at")
    list_filter   = ("status", "booked_at")
    search_fields = ("user__username", "user__email", "event__title")
    ordering      = ("-booked_at",)
    list_per_page = 25
    date_hierarchy = "booked_at"
    readonly_fields = ("booked_at",)
```

## api\apps.py

```py
from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'
```

## api\models.py

```py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('organizer', 'Organizer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    
    # We can use Django's built-in first_name/last_name or a separate name field.
    # The requirement says `name`, so let's add a name field that shadows
    name = models.CharField(max_length=120)
    
    def __str__(self):
        return self.username

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    date = models.DateTimeField()
    total_seats = models.IntegerField(default=100)
    booked_seats = models.IntegerField(default=0)
    price = models.FloatField(default=0.0)
    image_url = models.CharField(max_length=300, blank=True, null=True)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events_created')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def available_seats(self):
        return self.total_seats - self.booked_seats

    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"
```

## api\permissions.py

```py
from rest_framework.permissions import BasePermission

class IsOrganizerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['organizer', 'admin'])

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')
```

## api\serializers.py

```py
from rest_framework import serializers
from .models import User, Event, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'date_joined']

class EventSerializer(serializers.ModelSerializer):
    available_seats = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 
            'location', 'date', 'total_seats', 'booked_seats', 
            'available_seats', 'price', 'image_url', 'organizer_id'
        ]

class BookingSerializer(serializers.ModelSerializer):
    user_name      = serializers.CharField(source='user.name',          read_only=True)
    event_title    = serializers.CharField(source='event.title',        read_only=True)
    event_date     = serializers.DateTimeField(source='event.date',     read_only=True)
    event_location = serializers.CharField(source='event.location',     read_only=True)
    event_image    = serializers.CharField(source='event.image_url',    read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user_id', 'event_id', 'status', 'booked_at',
            'user_name', 'event_title', 'event_date', 'event_location', 'event_image',
        ]

```

## api\tests.py

```py
from django.test import TestCase

# Create your tests here.
```

## api\urls.py

```py
from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/profile/', views.profile, name='profile'),
    
    # Events
    path('events/', views.events_list, name='events_list'),
    path('events/<int:pk>/', views.event_detail, name='event_detail'),
    
    # Bookings
    path('bookings/', views.book_event, name='book_event'),
    path('bookings/me/', views.my_bookings, name='my_bookings'),
    path('bookings/<int:pk>/', views.cancel_booking, name='cancel_booking'),
    
    # Admin
    path('admin/users/', views.admin_users, name='admin_users'),
    path('admin/users/<int:pk>/', views.admin_delete_user, name='admin_delete_user'),
    path('admin/events/', views.admin_events, name='admin_events'),
    path('admin/bookings/', views.admin_bookings, name='admin_bookings'),
    path('admin/stats/', views.admin_stats, name='admin_stats'),
]
```

## api\views.py

```py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Booking
from .serializers import UserSerializer, EventSerializer, BookingSerializer
from .permissions import IsOrganizerOrAdmin, IsAdmin
from django.contrib.auth.hashers import make_password, check_password

# Auth Routes
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    if User.objects.filter(email=data.get('email')).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_409_CONFLICT)
    
    user = User.objects.create(
        username=data.get('email'),
        name=data.get('name'),
        email=data.get('email'),
        password=make_password(data.get('password')),
        role=data.get('role', 'user')
    )
    serializer = UserSerializer(user)
    return Response({'message': 'Registered successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data
    user = User.objects.filter(email=data.get('email')).first()
    if not user or not check_password(data.get('password'), user.password):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    
    return Response({
        'token': str(refresh.access_token),
        'user': UserSerializer(user).data
    })

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    elif request.method == 'PUT':
        data = request.data
        if 'name' in data:
            user.name = data['name']
        if 'password' in data:
            user.password = make_password(data['password'])
        if 'role' in data and data['role'] in ['user', 'organizer', 'admin']:
            user.role = data['role']
        user.save()
        return Response(UserSerializer(user).data)

# Events Routes
@api_view(['GET', 'POST'])
def events_list(request):
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if not IsOrganizerOrAdmin().has_permission(request, None):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['organizer_id'] = request.user.id
        # We manually create the event to match the previous structure
        event = Event.objects.create(
            title=data.get('title'),
            description=data.get('description'),
            category=data.get('category'),
            location=data.get('location'),
            date=data.get('date'),
            total_seats=data.get('total_seats', 100),
            price=data.get('price', 0),
            image_url=data.get('image_url'),
            organizer=request.user
        )
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def event_detail(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(EventSerializer(event).data)
    
    if not IsOrganizerOrAdmin().has_permission(request, None):
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    if event.organizer != request.user and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        event.delete()
        return Response({'message': 'Event deleted'})

# Bookings Routes
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_event(request):
    event_id = request.data.get('event_id')
    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if Booking.objects.filter(user=request.user, event=event, status='confirmed').exists():
        return Response({'error': 'Already booked'}, status=status.HTTP_409_CONFLICT)
        
    if event.available_seats <= 0:
        return Response({'error': 'No seats available'}, status=status.HTTP_400_BAD_REQUEST)
        
    booking = Booking.objects.create(user=request.user, event=event)
    event.booked_seats += 1
    event.save()
    return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    return Response(BookingSerializer(bookings, many=True).data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if booking.user != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
    booking.status = 'cancelled'
    booking.save()
    booking.event.booked_seats -= 1
    booking.event.save()
    return Response({'message': 'Booking cancelled'})

# Admin Routes
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_users(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data)

@api_view(['DELETE'])
@permission_classes([IsAdmin])
def admin_delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response({'message': 'User deleted'})
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_events(request):
    events = Event.objects.all()
    return Response(EventSerializer(events, many=True).data)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_bookings(request):
    bookings = Booking.objects.all()
    return Response(BookingSerializer(bookings, many=True).data)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_stats(request):
    return Response({
        'total_users': User.objects.count(),
        'total_events': Event.objects.count(),
        'total_bookings': Booking.objects.count(),
    })
```

## api\__init__.py

```py

```

## eventflow_backend\asgi.py

```py
"""
ASGI config for eventflow_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')

application = get_asgi_application()
```

## eventflow_backend\settings.py

```py
"""
Django settings for eventflow_backend project.

Generated by 'django-admin startproject' using Django 6.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/6.0/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(os.path.join(BASE_DIR, '.env'))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-y1g15^mcu_#l7)qo#*fi+n6op30$w7db)h=59q7ra_%#7xvi88'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'api.apps.ApiConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'eventflow_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'eventflow_backend.wsgi.application'



if os.environ.get('TURSO_DB_URL'):
    DATABASES = {
        'default': {
            'ENGINE': 'libsql.db.backends.sqlite3',
            'NAME': f"{os.environ.get('TURSO_DB_URL')}?authToken={os.environ.get('TURSO_AUTH_TOKEN')}",
        }
    }
elif os.environ.get('DB_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(default=os.environ.get('DB_URL'))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/6.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'api.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

CORS_ALLOW_ALL_ORIGINS = True


```

## eventflow_backend\urls.py

```py
"""
URL configuration for eventflow_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

## eventflow_backend\wsgi.py

```py
"""
WSGI config for eventflow_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')

application = get_wsgi_application()
```

## eventflow_backend\__init__.py

```py

```

## static\admin\css\eventflow_theme.css

```css
/*
 * EventFlow Admin Theme
 * Aesthetic: Dark Editorial Luxury
 * Fonts: Bebas Neue (display) + DM Sans (body) + DM Mono (labels)
 * Colors: Ink blacks, champagne gold, coral accent
 * ──────────────────────────────────────────────
 */

/* ── TOKENS ── */
:root {
  --ef-ink:       #0c0d0f;
  --ef-ink-2:     #141518;
  --ef-ink-3:     #1c1e24;
  --ef-ink-4:     #272932;
  --ef-ink-5:     #313542;
  --ef-gold:      #c8a96e;
  --ef-gold-lt:   #e8cc97;
  --ef-coral:     #e8614a;
  --ef-white:     #f0ece4;
  --ef-muted:     rgba(240,236,228,0.45);
  --ef-border:    rgba(255,255,255,0.07);
  --ef-border-g:  rgba(200,169,110,0.22);
  --ef-display:   'Bebas Neue', sans-serif;
  --ef-body:      'DM Sans', sans-serif;
  --ef-mono:      'DM Mono', monospace;
  --ef-r:         6px;
  --ef-r-md:      10px;
  --ef-shadow:    0 4px 24px rgba(0,0,0,0.4);
  --ef-shadow-g:  0 0 32px rgba(200,169,110,0.15);
}

/* ── GRAIN TEXTURE ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 9000;
}

/* ═══════════════════════════════════════════
   GLOBAL RESET
═══════════════════════════════════════════ */

html, body {
  background: var(--ef-ink) !important;
  color: var(--ef-white) !important;
  font-family: var(--ef-body) !important;
  font-size: 14px !important;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--ef-gold) !important; transition: opacity 0.2s; }
a:hover { opacity: 0.8; }

/* Headings use Bebas Neue */
h1, h2, h3, h4, h5, h6,
#site-name a,
.module h2,
.module caption,
#changelist h1,
#content h1 {
  font-family: var(--ef-display) !important;
  letter-spacing: 0.04em !important;
  color: var(--ef-white) !important;
}

/* ═══════════════════════════════════════════
   HEADER / TOP BAR
═══════════════════════════════════════════ */

#header {
  background: var(--ef-ink) !important;
  border-bottom: 1px solid var(--ef-border) !important;
  padding: 0 2rem !important;
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  box-shadow: none !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
}

#header a, #header a:visited { color: var(--ef-white) !important; }

#branding {
  display: flex;
  align-items: center;
  flex: 1;
}

#site-name {
  font-family: var(--ef-display) !important;
  font-size: 1.55rem !important;
  letter-spacing: 0.06em !important;
  margin: 0 !important;
}
#site-name a {
  color: var(--ef-white) !important;
  text-decoration: none !important;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

/* User tools (top right) */
#user-tools {
  font-family: var(--ef-mono) !important;
  font-size: 0.72rem !important;
  letter-spacing: 0.1em !important;
  color: var(--ef-muted) !important;
  text-transform: uppercase;
}
#user-tools a {
  color: var(--ef-gold) !important;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}
#user-tools a:hover { border-color: var(--ef-gold) !important; }

/* ═══════════════════════════════════════════
   BREADCRUMBS
═══════════════════════════════════════════ */

div.breadcrumbs {
  background: var(--ef-ink-2) !important;
  border-bottom: 1px solid var(--ef-border) !important;
  padding: 0.6rem 2rem !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.1em !important;
  color: var(--ef-muted) !important;
  text-transform: uppercase;
}
div.breadcrumbs a { color: var(--ef-gold) !important; }
div.breadcrumbs .separator { color: var(--ef-border) !important; margin: 0 0.4rem; }

/* ═══════════════════════════════════════════
   MAIN CONTENT AREA
═══════════════════════════════════════════ */

#content {
  background: transparent !important;
  padding: 2rem !important;
}

#content-main {
  background: transparent !important;
}

#container {
  background: var(--ef-ink) !important;
  min-height: 100vh;
}

/* ═══════════════════════════════════════════
   SIDEBAR NAV (#nav-sidebar / #content-related)
═══════════════════════════════════════════ */

#nav-sidebar {
  background: var(--ef-ink-2) !important;
  border-right: 1px solid var(--ef-border) !important;
}

#nav-sidebar .current-app .module__name,
#nav-sidebar .current-app .section:link,
#nav-sidebar .current-app .section:visited {
  color: var(--ef-gold) !important;
  font-weight: 600;
}

#nav-sidebar .section:link,
#nav-sidebar .section:visited {
  color: var(--ef-muted) !important;
  font-size: 0.78rem;
  padding: 6px 16px;
  transition: color 0.15s, background 0.15s;
}
#nav-sidebar .section:hover {
  color: var(--ef-white) !important;
  background: rgba(255,255,255,0.04) !important;
}

/* Search in sidebar */
#nav-sidebar .sticky { background: var(--ef-ink-2) !important; }
#nav-sidebar input {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r) !important;
  color: var(--ef-white) !important;
  font-family: var(--ef-body) !important;
}
#nav-sidebar input:focus {
  border-color: var(--ef-gold) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(200,169,110,0.1) !important;
}

/* Content-related sidebar (filter/recent actions) */
#content-related {
  background: var(--ef-ink-2) !important;
  border-left: 1px solid var(--ef-border) !important;
}
#content-related h3 {
  font-family: var(--ef-mono) !important;
  font-size: 0.65rem !important;
  letter-spacing: 0.18em !important;
  text-transform: uppercase !important;
  color: var(--ef-muted) !important;
  background: var(--ef-ink-3) !important;
  padding: 10px 14px !important;
  border-bottom: 1px solid var(--ef-border) !important;
  margin: 0 !important;
}
#content-related ul {
  padding: 0.5rem 0 !important;
}
#content-related ul li {
  padding: 0 !important;
}
#content-related ul li a {
  display: block;
  padding: 6px 14px !important;
  font-size: 0.8rem !important;
  color: rgba(240,236,228,0.6) !important;
  transition: color 0.15s, background 0.15s;
}
#content-related ul li a:hover {
  color: var(--ef-white) !important;
  background: rgba(255,255,255,0.04) !important;
}

/* ─── Changelist filter ─── */
#changelist-filter {
  background: var(--ef-ink-2) !important;
  border-left: 1px solid var(--ef-border) !important;
}
#changelist-filter h2 {
  font-family: var(--ef-mono) !important;
  font-size: 0.65rem !important;
  letter-spacing: 0.18em !important;
  text-transform: uppercase !important;
  background: var(--ef-ink-3) !important;
  color: var(--ef-muted) !important;
  padding: 10px 14px !important;
  border-bottom: 1px solid var(--ef-border) !important;
}
#changelist-filter h3 {
  font-family: var(--ef-mono) !important;
  font-size: 0.62rem !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  color: var(--ef-muted) !important;
  padding: 10px 14px 4px !important;
  margin: 0 !important;
}
#changelist-filter ul {
  padding: 0 !important;
  list-style: none !important;
}
#changelist-filter ul li {
  padding: 0 !important;
}
#changelist-filter ul li a {
  display: block;
  padding: 5px 14px !important;
  font-size: 0.8rem !important;
  color: rgba(240,236,228,0.55) !important;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}
#changelist-filter ul li a:hover,
#changelist-filter ul li.selected a {
  color: var(--ef-gold) !important;
  background: rgba(200,169,110,0.07) !important;
}
#changelist-filter ul li.selected a { font-weight: 600 !important; }

/* ═══════════════════════════════════════════
   MODULES / CARDS
═══════════════════════════════════════════ */

.module {
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r-md) !important;
  overflow: hidden !important;
  box-shadow: none !important;
}

.module h2,
.module caption {
  background: var(--ef-ink) !important;
  color: var(--ef-white) !important;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;
  border-bottom: 1px solid var(--ef-border) !important;
  letter-spacing: 0.06em !important;
}

.module table {
  background: transparent !important;
}

/* App index (dashboard) */
#content-main .app-api.module > table,
.model-list a {
  color: var(--ef-gold) !important;
}

/* ═══════════════════════════════════════════
   DASHBOARD — APP LIST
═══════════════════════════════════════════ */

/* App name in dashboard */
#content-main table td a,
.changelink,
.addlink {
  color: var(--ef-gold) !important;
}
.addlink::before { content: '+ '; }
.addlink { color: var(--ef-gold) !important; }
.changelink { color: rgba(240,236,228,0.65) !important; }

/* ═══════════════════════════════════════════
   DATA TABLES (changelist)
═══════════════════════════════════════════ */

#changelist {
  margin: 0 !important;
}

#result_list {
  width: 100% !important;
  border-collapse: collapse !important;
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r-md) !important;
  overflow: hidden !important;
}

#result_list thead th {
  background: var(--ef-ink) !important;
  color: var(--ef-muted) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.65rem !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  padding: 10px 14px !important;
  border-bottom: 1px solid var(--ef-border) !important;
  border-right: none !important;
  white-space: nowrap;
}
#result_list thead th a,
#result_list thead th a:visited {
  color: var(--ef-muted) !important;
}
#result_list thead th a:hover { color: var(--ef-white) !important; }

/* Sorted column indicator */
#result_list thead th.sorted a { color: var(--ef-gold) !important; }
#result_list thead th.sorted .sortoptions a { color: var(--ef-gold) !important; }

#result_list tbody tr {
  border-bottom: 1px solid rgba(255,255,255,0.04) !important;
  transition: background 0.15s;
}
#result_list tbody tr:hover td { background: rgba(255,255,255,0.03) !important; }
#result_list tbody tr.selected td { background: rgba(200,169,110,0.08) !important; }

#result_list tbody td {
  background: transparent !important;
  padding: 11px 14px !important;
  font-size: 0.845rem !important;
  color: rgba(240,236,228,0.72) !important;
  border-bottom: none !important;
  border-right: none !important;
}

#result_list tbody td a { color: var(--ef-white) !important; font-weight: 500; }
#result_list tbody td a:hover { color: var(--ef-gold) !important; }
#result_list tfoot td { background: var(--ef-ink) !important; padding: 10px 14px !important; }

/* Checkbox styling */
#result_list input[type="checkbox"] { accent-color: var(--ef-gold) !important; }
#changelist-form input[type="checkbox"] { accent-color: var(--ef-gold) !important; }

/* Action bar */
.actions {
  background: var(--ef-ink-2) !important;
  border: 1px solid var(--ef-border) !important;
  border-bottom: none !important;
  border-radius: var(--ef-r-md) var(--ef-r-md) 0 0 !important;
  padding: 8px 14px !important;
}
.actions label,
.actions span { color: var(--ef-muted) !important; font-size: 0.8rem !important; }

/* Select count */
#changelist .action-counter { color: var(--ef-gold) !important; font-family: var(--ef-mono) !important; font-size: 0.75rem !important; }

/* ═══════════════════════════════════════════
   SEARCH BAR (changelist top)
═══════════════════════════════════════════ */

#changelist-search { margin-bottom: 1rem !important; }

#searchbar {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r) !important;
  color: var(--ef-white) !important;
  padding: 9px 14px !important;
  font-family: var(--ef-body) !important;
  font-size: 0.875rem !important;
  transition: border-color 0.2s, box-shadow 0.2s;
}
#searchbar:focus {
  border-color: var(--ef-gold) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(200,169,110,0.1) !important;
}
#searchbar::placeholder { color: rgba(240,236,228,0.25) !important; }

/* ═══════════════════════════════════════════
   OBJECT TOOLS (Add, History buttons top-right)
═══════════════════════════════════════════ */

.object-tools { margin: 0 0 1rem 0 !important; }
.object-tools li { margin: 0 0 0 6px !important; }

.object-tools a,
.object-tools a:visited {
  background: var(--ef-ink-4) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r) !important;
  color: rgba(240,236,228,0.7) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  padding: 6px 14px !important;
  text-decoration: none !important;
  transition: all 0.2s !important;
}
.object-tools a:hover {
  border-color: var(--ef-border-g) !important;
  color: var(--ef-gold) !important;
  background: rgba(200,169,110,0.06) !important;
}
.object-tools a.addlink {
  background: var(--ef-gold) !important;
  border-color: var(--ef-gold) !important;
  color: var(--ef-ink) !important;
}
.object-tools a.addlink:hover {
  background: var(--ef-gold-lt) !important;
  border-color: var(--ef-gold-lt) !important;
  color: var(--ef-ink) !important;
}

/* ═══════════════════════════════════════════
   PAGINATION
═══════════════════════════════════════════ */

.paginator {
  background: var(--ef-ink) !important;
  border-top: 1px solid var(--ef-border) !important;
  padding: 10px 14px !important;
  color: var(--ef-muted) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.72rem !important;
  letter-spacing: 0.08em !important;
}
.paginator a, .paginator a:visited {
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r) !important;
  color: var(--ef-muted) !important;
  padding: 4px 10px !important;
  margin: 0 2px !important;
  transition: all 0.2s !important;
}
.paginator a:hover { border-color: var(--ef-border-g) !important; color: var(--ef-gold) !important; }
.paginator .this-page {
  background: var(--ef-gold) !important;
  color: var(--ef-ink) !important;
  border-radius: var(--ef-r) !important;
  padding: 4px 10px !important;
  margin: 0 2px !important;
  font-weight: 700 !important;
}

/* ═══════════════════════════════════════════
   FORM ELEMENTS
═══════════════════════════════════════════ */

input[type="text"],
input[type="password"],
input[type="email"],
input[type="number"],
input[type="url"],
input[type="date"],
input[type="datetime-local"],
input[type="search"],
textarea,
select {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r) !important;
  color: var(--ef-white) !important;
  font-family: var(--ef-body) !important;
  font-size: 0.875rem !important;
  padding: 9px 14px !important;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
input[type="url"]:focus,
input[type="date"]:focus,
input[type="datetime-local"]:focus,
textarea:focus,
select:focus {
  border-color: var(--ef-gold) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(200,169,110,0.1) !important;
  background: rgba(255,255,255,0.07) !important;
}

select option { background: var(--ef-ink-3) !important; color: var(--ef-white) !important; }
textarea { min-height: 110px !important; }

label, .form-row label {
  color: var(--ef-muted) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
}

.help, p.help {
  color: rgba(240,236,228,0.35) !important;
  font-size: 0.78rem !important;
  font-style: normal !important;
  margin-top: 4px !important;
}

.form-row {
  border-bottom: 1px solid var(--ef-border) !important;
  padding: 1rem 1.5rem !important;
}
.form-row:last-child { border-bottom: none !important; }

.aligned label { width: 180px !important; }

/* Related widget links */
.related-widget-wrapper a { color: var(--ef-gold) !important; }

/* Inline stacked */
.inline-group {
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r-md) !important;
  overflow: hidden !important;
  margin-bottom: 1rem !important;
}
.inline-group h2 {
  background: var(--ef-ink) !important;
  color: var(--ef-white) !important;
  padding: 10px 16px !important;
  font-size: 0.9rem !important;
  border-bottom: 1px solid var(--ef-border) !important;
}

/* ═══════════════════════════════════════════
   SUBMIT / ACTION BUTTONS
═══════════════════════════════════════════ */

.submit-row {
  background: var(--ef-ink-2) !important;
  border-top: 1px solid var(--ef-border) !important;
  padding: 1rem 1.5rem !important;
  display: flex !important;
  gap: 0.75rem !important;
  flex-wrap: wrap !important;
  align-items: center !important;
}

input[type="submit"],
button[type="submit"],
.button,
.submit-row input,
.submit-row a {
  background: var(--ef-gold) !important;
  border: none !important;
  border-radius: var(--ef-r) !important;
  color: var(--ef-ink) !important;
  font-family: var(--ef-body) !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  padding: 9px 20px !important;
  cursor: pointer !important;
  transition: background 0.2s, transform 0.15s !important;
  text-decoration: none !important;
  letter-spacing: 0.02em !important;
}
input[type="submit"]:hover,
button[type="submit"]:hover,
.button:hover,
.submit-row input:hover {
  background: var(--ef-gold-lt) !important;
  transform: translateY(-1px) !important;
}
input[type="submit"][name="_continue"],
input[type="submit"][name="_addanother"] {
  background: var(--ef-ink-4) !important;
  border: 1px solid var(--ef-border) !important;
  color: var(--ef-white) !important;
}
input[type="submit"][name="_continue"]:hover,
input[type="submit"][name="_addanother"]:hover {
  background: var(--ef-ink-5) !important;
  border-color: var(--ef-border-g) !important;
}

/* Delete button */
.submit-row a.deletelink,
.deletelink {
  background: rgba(232,97,74,0.12) !important;
  border: 1px solid rgba(232,97,74,0.3) !important;
  color: #f87171 !important;
  margin-left: auto !important;
}
.submit-row a.deletelink:hover,
.deletelink:hover {
  background: rgba(232,97,74,0.2) !important;
  border-color: rgba(232,97,74,0.5) !important;
  transform: none !important;
}

/* Action dropdown */
select[name="action"] {
  background: var(--ef-ink-4) !important;
  border: 1px solid var(--ef-border) !important;
  color: var(--ef-white) !important;
  padding: 7px 12px !important;
}
button.button.action-select-all,
.actions button[type="submit"] {
  background: var(--ef-ink-4) !important;
  border: 1px solid var(--ef-border) !important;
  color: var(--ef-muted) !important;
  padding: 7px 14px !important;
}
.actions button[type="submit"]:hover {
  border-color: var(--ef-border-g) !important;
  color: var(--ef-gold) !important;
  background: rgba(200,169,110,0.06) !important;
  transform: none !important;
}

/* ═══════════════════════════════════════════
   MESSAGES / ALERTS
═══════════════════════════════════════════ */

ul.messagelist { padding: 0 2rem !important; margin: 0 !important; list-style: none !important; }
ul.messagelist li {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 12px 16px !important;
  border-radius: var(--ef-r) !important;
  margin-bottom: 0.75rem !important;
  font-size: 0.875rem !important;
  background-image: none !important;
  border: 1px solid !important;
}
ul.messagelist li.success {
  background: rgba(74,222,128,0.1) !important;
  border-color: rgba(74,222,128,0.25) !important;
  color: #4ade80 !important;
}
ul.messagelist li.warning {
  background: rgba(200,169,110,0.1) !important;
  border-color: rgba(200,169,110,0.25) !important;
  color: var(--ef-gold) !important;
}
ul.messagelist li.error {
  background: rgba(232,97,74,0.1) !important;
  border-color: rgba(232,97,74,0.25) !important;
  color: #f87171 !important;
}
ul.messagelist li::before { display: none !important; }

/* ═══════════════════════════════════════════
   DASHBOARD STATS MODULES
═══════════════════════════════════════════ */

/* Recent actions module */
#recent-actions-module h2 {
  font-size: 0.95rem !important;
  font-family: var(--ef-display) !important;
  letter-spacing: 0.05em !important;
}
#recent-actions-module .actionlist { padding: 0 !important; margin: 0 !important; list-style: none !important; }
#recent-actions-module .actionlist li {
  padding: 8px 14px !important;
  border-bottom: 1px solid var(--ef-border) !important;
  font-size: 0.8rem !important;
  color: rgba(240,236,228,0.65) !important;
}
#recent-actions-module .actionlist li:last-child { border-bottom: none !important; }
#recent-actions-module .actionlist li a { color: var(--ef-gold) !important; }
#recent-actions-module .mini.quiet {
  color: var(--ef-muted) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.68rem !important;
  letter-spacing: 0.05em !important;
  display: block;
  margin-top: 3px;
}

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */

body.login {
  background: var(--ef-ink) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

#login-form {
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border-g) !important;
  border-radius: var(--ef-r-md) !important;
  padding: 2.5rem !important;
  width: 100% !important;
  max-width: 400px !important;
  box-shadow: var(--ef-shadow), var(--ef-shadow-g) !important;
}

#login-form h2 {
  font-family: var(--ef-display) !important;
  font-size: 2rem !important;
  letter-spacing: 0.04em !important;
  color: var(--ef-white) !important;
  margin-bottom: 1.75rem !important;
  text-align: center;
}

body.login #header {
  position: static !important;
  height: auto !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  justify-content: center;
  margin-bottom: 1.5rem;
}

body.login #site-name {
  font-size: 2rem !important;
  text-align: center;
  display: block;
}

#login-form .form-row {
  border: none !important;
  padding: 0 0 1rem 0 !important;
}

#login-form input[type="submit"] {
  width: 100% !important;
  padding: 12px !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.04em !important;
}

.login .password-reset-link a {
  color: var(--ef-gold) !important;
  font-size: 0.8rem !important;
  font-family: var(--ef-mono) !important;
}

/* ═══════════════════════════════════════════
   CALENDAR / DATE PICKER
═══════════════════════════════════════════ */

.calendarbox, .clockbox {
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border-g) !important;
  border-radius: var(--ef-r-md) !important;
  box-shadow: var(--ef-shadow) !important;
}
.calendar caption {
  background: var(--ef-ink) !important;
  color: var(--ef-white) !important;
  font-family: var(--ef-display) !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.05em !important;
  padding: 8px !important;
  border-bottom: 1px solid var(--ef-border) !important;
}
.calendar th {
  background: var(--ef-ink-2) !important;
  color: var(--ef-muted) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.65rem !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  padding: 6px !important;
}
.calendar td { background: transparent !important; padding: 4px !important; }
.calendar td a, .calendar td span {
  color: rgba(240,236,228,0.7) !important;
  display: block;
  padding: 4px 8px !important;
  border-radius: 4px;
  text-align: center;
  transition: background 0.15s;
}
.calendar td a:hover { background: rgba(200,169,110,0.15) !important; color: var(--ef-gold) !important; }
.calendar td.selected a { background: var(--ef-gold) !important; color: var(--ef-ink) !important; }
.calendar td.today a { color: var(--ef-gold) !important; font-weight: 700 !important; }
.calendarbox .calnavigation a { color: var(--ef-gold) !important; }

/* Clock widget */
.clockbox h2 {
  background: var(--ef-ink) !important;
  color: var(--ef-white) !important;
  font-family: var(--ef-display) !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.05em !important;
  padding: 8px !important;
  border-bottom: 1px solid var(--ef-border) !important;
  margin: 0 !important;
}

/* ═══════════════════════════════════════════
   POPUP WINDOWS
═══════════════════════════════════════════ */

.selector {
  background: transparent !important;
}
.selector select {
  background: rgba(255,255,255,0.05) !important;
}
.selector .selector-chosen h2,
.selector .selector-available h2 {
  background: var(--ef-ink) !important;
  color: var(--ef-muted) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.65rem !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  padding: 8px 12px !important;
  border: 1px solid var(--ef-border) !important;
  border-bottom: none !important;
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */

#footer {
  background: var(--ef-ink) !important;
  border-top: 1px solid var(--ef-border) !important;
  color: rgba(240,236,228,0.25) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.68rem !important;
  letter-spacing: 0.1em !important;
  text-align: center !important;
  padding: 1.25rem 2rem !important;
  text-transform: uppercase;
}
#footer p { margin: 0 !important; }

/* ═══════════════════════════════════════════
   SCROLLBAR
═══════════════════════════════════════════ */

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--ef-ink-2); }
::-webkit-scrollbar-thumb { background: var(--ef-ink-4); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--ef-gold); }

/* ═══════════════════════════════════════════
   MISC UTILITY OVERRIDES
═══════════════════════════════════════════ */

.errornote {
  background: rgba(232,97,74,0.1) !important;
  border: 1px solid rgba(232,97,74,0.3) !important;
  border-radius: var(--ef-r) !important;
  color: #f87171 !important;
  padding: 12px 16px !important;
  font-size: 0.875rem !important;
}
.errorlist { color: #f87171 !important; font-size: 0.8rem !important; list-style: none !important; padding: 4px 0 !important; }
.errorlist li::before { content: '⚠ ' !important; }

/* Collapsible fieldsets */
fieldset.collapse { background: var(--ef-ink-3) !important; }
fieldset.collapse .collapse-toggle {
  color: var(--ef-gold) !important;
  font-family: var(--ef-mono) !important;
  font-size: 0.72rem !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase;
}
fieldset {
  background: var(--ef-ink-3) !important;
  border: 1px solid var(--ef-border) !important;
  border-radius: var(--ef-r-md) !important;
  margin-bottom: 1rem !important;
  padding: 0 !important;
  overflow: hidden !important;
}
fieldset h2 {
  background: var(--ef-ink) !important;
  color: var(--ef-white) !important;
  padding: 10px 16px !important;
  font-size: 0.9rem !important;
  font-family: var(--ef-display) !important;
  letter-spacing: 0.05em !important;
  border-bottom: 1px solid var(--ef-border) !important;
  margin: 0 !important;
}

/* Responsive tweaks */
@media (max-width: 767px) {
  #header { padding: 0 1rem !important; }
  #content { padding: 1rem !important; }
}
```

## templates\admin\base_site.html

```html
{% extends "admin/base.html" %}
{% load i18n static %}

{% block title %}{% if subtitle %}{{ subtitle }} | {% endif %}{{ title }} | EventFlow Admin{% endblock %}

{% block branding %}
<h1 id="site-name">
  <a href="{% url 'admin:index' %}">
    Event<span style="color: var(--ef-gold);">Flow</span>
    <span style="font-size: 0.55rem; letter-spacing: 0.2em; vertical-align: middle; color: var(--ef-muted); margin-left: 8px; font-family: var(--ef-mono);">ADMIN</span>
  </a>
</h1>
{% endblock %}

{% block extrastyle %}
{{ block.super }}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="{% static 'admin/css/eventflow_theme.css' %}" />
{% endblock %}

{% block footer %}
<div id="footer">
  <p>
    EventFlow Admin &mdash; CountryEdu Private Limited &copy; {% now "Y" %}
  </p>
</div>
{% endblock %}
```

