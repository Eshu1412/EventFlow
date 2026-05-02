import os
import django
from django.utils import timezone
from datetime import timedelta

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')
django.setup()

from api.models import User, Event

def create_data():
    email = "mauryatushar115.dev@gmail.com"
    password = "EshuMaurya@1412"
    
    # Check if user already exists
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'name': 'Tushar Maurya (Organizer)',
            'role': 'organizer'
        }
    )
    
    if not created:
        print(f"User {email} already exists. Updating password and role...")
        user.role = 'organizer'
    
    user.set_password(password)
    user.save()
    print(f"Organizer created/updated: {user.email}")
    
    # Create 15 more events
    events_data = [
        {
            'title': 'AI in Healthcare Symposium',
            'description': 'Explore how artificial intelligence is revolutionizing patient care, diagnostics, and medical research. Featuring top doctors and data scientists.',
            'category': 'technology',
            'location': 'Grand Hyatt, Mumbai',
            'date': timezone.now() + timedelta(days=12),
            'total_seats': 400,
            'price': 1200.00,
            'image_url': 'https://images.unsplash.com/photo-1576091160550-2173ff9e5eb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Gourmet Food Festival',
            'description': 'A weekend of culinary delight featuring Michelin-starred chefs, wine tasting, and interactive cooking masterclasses.',
            'category': 'food',
            'location': 'Mahalaxmi Race Course',
            'date': timezone.now() + timedelta(days=20),
            'total_seats': 1000,
            'price': 899.00,
            'image_url': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Modern Art Exhibition: Perspectives',
            'description': 'An exclusive viewing of contemporary art pieces from emerging artists across Asia. Includes a guided tour and networking reception.',
            'category': 'art',
            'location': 'Jehangir Art Gallery',
            'date': timezone.now() + timedelta(days=5),
            'total_seats': 200,
            'price': 299.00,
            'image_url': 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Marathon for a Cause 2026',
            'description': 'Join thousands of runners in our annual charity marathon. Support local education initiatives while challenging your physical limits.',
            'category': 'sports',
            'location': 'Marine Drive, Mumbai',
            'date': timezone.now() + timedelta(days=45),
            'total_seats': 5000,
            'price': 150.00,
            'image_url': 'https://images.unsplash.com/photo-1552674605-171ff5ea3644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'E-Commerce Growth Masterclass',
            'description': 'Learn advanced strategies for scaling your online business, optimizing conversion rates, and mastering digital marketing.',
            'category': 'business',
            'location': 'Taj Lands End',
            'date': timezone.now() + timedelta(days=25),
            'total_seats': 150,
            'price': 1999.00,
            'image_url': 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Symphony Orchestra Night',
            'description': 'Experience the magic of classical music with a full 60-piece orchestra performing timeless masterpieces.',
            'category': 'music',
            'location': 'NCPA, Nariman Point',
            'date': timezone.now() + timedelta(days=18),
            'total_seats': 800,
            'price': 1500.00,
            'image_url': 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Cybersecurity Defense Workshop',
            'description': 'Hands-on training for IT professionals to identify vulnerabilities and secure enterprise networks against modern threats.',
            'category': 'technology',
            'location': 'Virtual / Online',
            'date': timezone.now() + timedelta(days=8),
            'total_seats': 300,
            'price': 750.00,
            'image_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Street Food Photography Walk',
            'description': 'A guided photowalk through bustling markets. Learn to capture the vibrant colors and action of street food vendors.',
            'category': 'art',
            'location': 'Crawford Market',
            'date': timezone.now() + timedelta(days=14),
            'total_seats': 30,
            'price': 350.00,
            'image_url': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'National Yoga Retreat',
            'description': 'A full day of mindfulness, meditation, and advanced yoga flows led by internationally renowned instructors.',
            'category': 'sports',
            'location': 'Sanjay Gandhi National Park',
            'date': timezone.now() + timedelta(days=60),
            'total_seats': 500,
            'price': 600.00,
            'image_url': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'FinTech Disruption Conference',
            'description': 'Discussing the future of money, blockchain innovations, and decentralized finance with industry leaders.',
            'category': 'business',
            'location': 'Bombay Stock Exchange',
            'date': timezone.now() + timedelta(days=35),
            'total_seats': 450,
            'price': 2500.00,
            'image_url': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Electronic Dance Music Festival',
            'description': 'Dance the night away with world-class DJs, stunning visual effects, and an unforgettable party atmosphere.',
            'category': 'music',
            'location': 'Sunburn Arena',
            'date': timezone.now() + timedelta(days=50),
            'total_seats': 3000,
            'price': 1999.00,
            'image_url': 'https://images.unsplash.com/photo-1470229722913-7c092db62220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Cloud Architecture Deep Dive',
            'description': 'An intensive seminar on building resilient, scalable, and cost-effective infrastructure on AWS and Azure.',
            'category': 'technology',
            'location': 'Nesco IT Park',
            'date': timezone.now() + timedelta(days=40),
            'total_seats': 250,
            'price': 999.00,
            'image_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Vegan Baking Workshop',
            'description': 'Learn to bake delicious cakes, pastries, and bread entirely plant-based. Ingredients provided.',
            'category': 'food',
            'location': 'Culinary Arts Studio, Bandra',
            'date': timezone.now() + timedelta(days=22),
            'total_seats': 20,
            'price': 1200.00,
            'image_url': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Abstract Painting Masterclass',
            'description': 'Unlock your creativity in this hands-on workshop focused on color theory, texture, and abstract expressionism.',
            'category': 'art',
            'location': 'The Canvas Studio',
            'date': timezone.now() + timedelta(days=10),
            'total_seats': 40,
            'price': 500.00,
            'image_url': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            'title': 'Annual Badminton Championship',
            'description': 'Watch top national players compete for the title. Open to spectators of all ages.',
            'category': 'sports',
            'location': 'NSCI Dome',
            'date': timezone.now() + timedelta(days=28),
            'total_seats': 1500,
            'price': 200.00,
            'image_url': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }
    ]
    
    created_events = 0
    for edata in events_data:
        # Check if event already exists to prevent duplicates if script is run multiple times
        if not Event.objects.filter(title=edata['title']).exists():
            Event.objects.create(
                organizer=user,
                **edata
            )
            created_events += 1
            
    print(f"Successfully created {created_events} events for organizer {user.name}")

if __name__ == '__main__':
    create_data()
