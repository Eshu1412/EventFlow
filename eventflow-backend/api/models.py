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
    quantity = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"


import uuid

class PasswordResetToken(models.Model):
    """Single-use token for password reset via email. Expires after 1 hour."""
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_tokens")
    token      = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used       = models.BooleanField(default=False)

    def is_valid(self):
        from datetime import timedelta
        return not self.used and timezone.now() < self.created_at + timedelta(hours=1)

    def __str__(self):
        return f"ResetToken({self.user.email}, used={self.used})"


import random

class EmailOTP(models.Model):
    """6-digit OTP for email verification during registration. Expires in 10 minutes."""
    email      = models.EmailField()
    otp        = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    verified   = models.BooleanField(default=False)
    attempts   = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def is_valid(self):
        from datetime import timedelta
        return (
            not self.verified
            and self.attempts < 5
            and timezone.now() < self.created_at + timedelta(minutes=10)
        )

    @classmethod
    def generate(cls, email):
        """Delete old OTPs for this email and create a fresh one."""
        cls.objects.filter(email__iexact=email).delete()
        code = str(random.randint(100000, 999999))
        return cls.objects.create(email=email.lower(), otp=code)

    def __str__(self):
        return f"OTP({self.email}, verified={self.verified})"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title} - {self.rating} Stars"

