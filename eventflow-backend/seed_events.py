import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')
django.setup()

from api.models import Event, User

organizer_email = 'mauryatushar115.dev@gmail.com'

try:
    organizer = User.objects.get(email=organizer_email)
except User.DoesNotExist:
    print(f"User {organizer_email} does not exist!")
    exit(1)

categories = ['Tech', 'Music', 'Sports', 'Food', 'Art', 'Business']
locations = ['Mumbai, India', 'Delhi, India', 'Bengaluru, India', 'Hyderabad, India', 'Chennai, India', 'Kolkata, India', 'Pune, India', 'Ahmedabad, India', 'Jaipur, India', 'Surat, India']
adjectives = ['Global', 'Annual', 'Ultimate', 'Advanced', 'Interactive', 'Next-Gen', 'Classic', 'Creative', 'Modern', 'Exclusive']
nouns = ['Summit', 'Festival', 'Workshop', 'Conference', 'Masterclass', 'Expo', 'Meetup', 'Gala', 'Retreat', 'Showcase']

def generate_title(category):
    adj = random.choice(adjectives)
    noun = random.choice(nouns)
    return f"{adj} {category} {noun} 2026"

def generate_image(category):
    # Mapping to Unsplash images
    images = {
        'Tech': 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800',
        'Music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800',
        'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
        'Food': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
        'Art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
        'Business': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800'
    }
    return images.get(category, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800')

def generate_description(title):
    return f"Join us for the {title}, a premier event gathering enthusiasts and professionals. Experience engaging sessions, networking opportunities, and memorable moments. Don't miss out on this incredible experience!"

events_to_create = []

for i in range(35):
    cat = random.choice(categories)
    title = generate_title(cat)
    # Ensure unique title per generation run just to be safe
    title = f"{title} - Edition {random.randint(1, 100)}"
    
    # Random date within the next 60 days
    days_ahead = random.randint(1, 60)
    event_date = timezone.now() + timedelta(days=days_ahead)
    
    events_to_create.append(
        Event(
            title=title,
            description=generate_description(title),
            category=cat,
            location=random.choice(locations),
            date=event_date,
            total_seats=random.choice([50, 100, 200, 500, 1000]),
            price=round(random.uniform(0, 5000), 2) if random.random() > 0.2 else 0.0, # 20% free
            image_url=generate_image(cat),
            organizer=organizer
        )
    )

# Bulk create
Event.objects.bulk_create(events_to_create)

print(f"Successfully created {len(events_to_create)} events for {organizer_email}.")
