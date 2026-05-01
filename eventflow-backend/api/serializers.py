from rest_framework import serializers
from .models import User, Event, Booking, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'date_joined']

class EventSerializer(serializers.ModelSerializer):
    available_seats  = serializers.ReadOnlyField()
    organizer_name   = serializers.CharField(source='organizer.name', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category',
            'location', 'date', 'total_seats', 'booked_seats',
            'available_seats', 'price', 'image_url', 'organizer_id', 'organizer_name'
        ]

class BookingSerializer(serializers.ModelSerializer):
    user_name      = serializers.CharField(source='user.name',          read_only=True)
    event_title    = serializers.CharField(source='event.title',        read_only=True)
    event_date     = serializers.DateTimeField(source='event.date',     read_only=True)
    event_location = serializers.CharField(source='event.location',     read_only=True)
    event_image    = serializers.CharField(source='event.image_url',    read_only=True)
    event_price    = serializers.FloatField(source='event.price',       read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user_id', 'event_id', 'status', 'booked_at', 'quantity',
            'user_name', 'event_title', 'event_date', 'event_location',
            'event_image', 'event_price',
        ]

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_id', 'event_id', 'rating', 'comment', 'created_at', 'user_name']
