from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/profile/', views.profile, name='profile'),
    path('auth/password-reset/', views.password_reset_request, name='password_reset_request'),
    path('auth/password-reset/confirm/', views.password_reset_confirm, name='password_reset_confirm'),

    # Events (public GET, organizer/admin POST)
    path('events/', views.events_list, name='events_list'),
    path('events/<int:pk>/', views.event_detail, name='event_detail'),
    path('events/<int:pk>/reviews/', views.event_reviews, name='event_reviews'),

    # Bookings (authenticated users)
    path('bookings/', views.book_event, name='book_event'),
    path('bookings/me/', views.my_bookings, name='my_bookings'),
    path('bookings/<int:pk>/', views.cancel_booking, name='cancel_booking'),
    path('bookings/<int:pk>/ticket/', views.download_ticket, name='download_ticket'),

    # OTP email verification
    path('auth/send-otp/', views.send_registration_otp, name='send_registration_otp'),
    path('auth/verify-otp/', views.verify_registration_otp, name='verify_registration_otp'),

    # Admin
    path('admin/users/', views.admin_users, name='admin_users'),
    path('admin/users/<int:pk>/', views.admin_manage_user, name='admin_manage_user'),
    path('admin/events/', views.admin_events, name='admin_events'),
    path('admin/bookings/', views.admin_bookings, name='admin_bookings'),
    path('admin/stats/', views.admin_stats, name='admin_stats'),

    # Organizer
    path('organizer/bookings/', views.organizer_bookings, name='organizer_bookings'),
]
