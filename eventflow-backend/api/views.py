from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Booking, PasswordResetToken, EmailOTP, Review
from .serializers import UserSerializer, EventSerializer, BookingSerializer, ReviewSerializer
from .permissions import IsOrganizerOrAdmin, IsAdmin
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse

# Auth Routes
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data     = request.data
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password', '')
    name     = (data.get('name') or '').strip()
    role     = data.get('role', 'user')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_409_CONFLICT)

    # OTP gate — must have a verified OTP record for this email
    otp_record = EmailOTP.objects.filter(email=email, verified=True).order_by('-created_at').first()
    if not otp_record:
        return Response({'error': 'Email not verified. Please verify your email with the OTP first.'}, status=status.HTTP_400_BAD_REQUEST)
    otp_record.delete()   # consume the verified record

    user = User.objects.create(
        username=email,
        name=name,
        email=email,
        password=make_password(password),
        role=role,
    )
    return Response({'message': 'Registered successfully', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)

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
@permission_classes([AllowAny])
def events_list(request):
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if not IsOrganizerOrAdmin().has_permission(request, None):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
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
@permission_classes([AllowAny])
def event_detail(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(EventSerializer(event).data)

    # Write operations require authentication
    if not request.user or not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

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

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def event_reviews(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        reviews = Review.objects.filter(event=event)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data
        rating = data.get('rating', 5)
        comment = data.get('comment', '')
        
        # Optionally, check if user has already reviewed or if they attended
        # For simplicity, let's just create it
        review = Review.objects.create(
            user=request.user,
            event=event,
            rating=int(rating),
            comment=comment
        )
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

# Bookings Routes
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_event(request):
    event_id = request.data.get('event_id')
    quantity = int(request.data.get('quantity', 1))
    
    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if event.available_seats < quantity:
        return Response({'error': 'Not enough seats available'}, status=status.HTTP_400_BAD_REQUEST)
        
    booking = Booking.objects.create(user=request.user, event=event, quantity=quantity)
    event.booked_seats += quantity
    event.save()

    # Send ticket email (non-blocking — log failures, never break booking)
    try:
        from .ticket_utils import send_ticket_email
        send_ticket_email(booking)
    except Exception as exc:
        import logging
        logging.getLogger(__name__).warning("Ticket email failed: %s", exc)

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
    booking.event.booked_seats -= booking.quantity
    booking.event.save()
    return Response({'message': 'Booking cancelled'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_ticket(request, pk):
    """
    GET /api/bookings/<pk>/ticket/
    Returns the booking ticket as a PDF download.
    Only the owner (or admin) may download.
    """
    try:
        booking = Booking.objects.select_related('user', 'event').get(pk=pk)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

    if booking.user != request.user and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    from .ticket_utils import generate_ticket_pdf
    pdf_buf = generate_ticket_pdf(booking)

    filename = f"EventFlow_Ticket_{booking.id:06d}.pdf"
    response = HttpResponse(pdf_buf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response['Access-Control-Expose-Headers'] = 'Content-Disposition'
    return response

# Admin Routes
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_users(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_manage_user(request, pk):
    """Admin: update user role/name OR delete a user by ID."""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        user.delete()
        return Response({'message': 'User deleted'})

    elif request.method == 'PUT':
        data = request.data
        if 'name' in data:
            user.name = data['name']
        if 'role' in data and data['role'] in ['user', 'organizer', 'admin']:
            user.role = data['role']
        user.save()
        return Response(UserSerializer(user).data)

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

# Organizer Routes
@api_view(['GET'])
@permission_classes([IsOrganizerOrAdmin])
def organizer_bookings(request):
    """Returns bookings for events owned by the requesting organizer."""
    bookings = Booking.objects.filter(event__organizer=request.user)
    return Response(BookingSerializer(bookings, many=True).data)


# ── Password Reset via Email ───────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    POST /api/auth/password-reset/
    Body: { "email": "user@example.com" }
    Always returns 200 to prevent email enumeration.
    Sends a reset link to the email if an account exists.
    """
    from django.core.mail import send_mail
    from django.conf import settings

    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        # Return 200 to avoid leaking which emails are registered
        return Response({'message': 'If that email is registered, a reset link has been sent.'}, status=status.HTTP_200_OK)

    # Invalidate old unused tokens for this user
    PasswordResetToken.objects.filter(user=user, used=False).delete()

    # Create a fresh token
    token_obj = PasswordResetToken.objects.create(user=user)
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token_obj.token}"

    # HTML email body
    html_body = f"""
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0c0d0f;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#b8924e,#966a1e);padding:32px 40px">
        <h1 style="margin:0;font-size:28px;letter-spacing:0.08em;color:#fff;font-weight:900">
          Event<span style="color:#0c0d0f">Flow</span>
        </h1>
      </div>
      <div style="padding:40px">
        <h2 style="margin:0 0 12px;font-size:22px;color:#ffffff">Reset your password</h2>
        <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 28px">
          Hi <strong style="color:#fff">{user.name or user.email}</strong>,<br/>
          We received a request to reset the password for your EventFlow account.
          Click the button below to choose a new password. This link expires in <strong style="color:#b8924e">1 hour</strong>.
        </p>
        <a href="{reset_url}"
           style="display:inline-block;padding:14px 32px;background:#b8924e;color:#0c0d0f;
                  font-weight:700;font-size:15px;border-radius:8px;text-decoration:none;
                  letter-spacing:0.04em">
          Reset Password
        </a>
        <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:32px;line-height:1.6">
          If you didn't request a password reset, you can safely ignore this email.
          Your password will not be changed.<br/><br/>
          Or copy this link: <a href="{reset_url}" style="color:#b8924e">{reset_url}</a>
        </p>
      </div>
      <div style="background:#141518;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px">
          &copy; 2025 EventFlow &mdash; Tushar Maurya &mdash; B.Tech IT Project
        </p>
      </div>
    </div>
    """

    send_mail(
        subject="Reset your EventFlow password",
        message=f"Reset your password: {reset_url}\n\nThis link expires in 1 hour.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_body,
        fail_silently=False,
    )

    return Response({'message': 'If that email is registered, a reset link has been sent.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """
    POST /api/auth/password-reset/confirm/
    Body: { "token": "<uuid>", "password": "<new-password>" }
    """
    token_str = request.data.get('token', '').strip()
    new_password = request.data.get('password', '').strip()

    if not token_str or not new_password:
        return Response({'error': 'Token and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({'error': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token_obj = PasswordResetToken.objects.select_related('user').get(token=token_str)
    except (PasswordResetToken.DoesNotExist, ValueError):
        return Response({'error': 'Invalid or expired reset link. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    if not token_obj.is_valid():
        return Response({'error': 'This reset link has expired or already been used. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    # Set new password and mark token as used
    user = token_obj.user
    user.password = make_password(new_password)
    user.save(update_fields=['password'])

    token_obj.used = True
    token_obj.save(update_fields=['used'])

    return Response({'message': 'Password reset successful. You can now log in with your new password.'}, status=status.HTTP_200_OK)


# ── OTP Email Verification (Registration) ───────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def send_registration_otp(request):
    """
    POST /api/auth/send-otp/
    Body: { "email": "user@example.com" }
    Generates a 6-digit OTP and emails it. Rate-limited to 1 per 10 minutes per email.
    """
    from django.core.mail import send_mail
    from django.conf import settings

    email = (request.data.get('email') or '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_409_CONFLICT)

    # Generate OTP
    otp_obj = EmailOTP.generate(email)

    html_body = f"""
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0c0d0f;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#b8924e,#966a1e);padding:28px 36px">
        <h1 style="margin:0;font-size:26px;letter-spacing:0.08em;color:#fff;font-weight:900">Event<span style="color:#0c0d0f">Flow</span></h1>
      </div>
      <div style="padding:36px">
        <h2 style="margin:0 0 10px;font-size:20px;color:#ffffff">Verify your email</h2>
        <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 28px">
          Use the code below to verify your email address for EventFlow. It expires in <strong style="color:#b8924e">10 minutes</strong>.
        </p>
        <div style="background:rgba(255,255,255,0.05);border:1px dashed rgba(184,146,78,0.5);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:42px;font-weight:900;letter-spacing:0.2em;color:#b8924e;font-family:monospace">{otp_obj.otp}</span>
        </div>
        <p style="color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <div style="background:#141518;padding:18px 36px;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px">&copy; 2025 EventFlow &mdash; Tushar Maurya</p>
      </div>
    </div>
    """

    try:
        send_mail(
            subject="Your EventFlow verification code",
            message=f"Your EventFlow OTP is: {otp_obj.otp}\n\nExpires in 10 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_body,
            fail_silently=False,
        )
    except Exception as e:
        otp_obj.delete()
        return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'OTP sent to your email. Valid for 10 minutes.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_registration_otp(request):
    """
    POST /api/auth/verify-otp/
    Body: { "email": "user@example.com", "otp": "123456" }
    Validates OTP and marks it as verified so registration can proceed.
    """
    email = (request.data.get('email') or '').strip().lower()
    code  = (request.data.get('otp')   or '').strip()

    if not email or not code:
        return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

    otp_obj = EmailOTP.objects.filter(email=email).order_by('-created_at').first()

    if not otp_obj:
        return Response({'error': 'No OTP found. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    # Track brute-force attempts
    otp_obj.attempts += 1
    otp_obj.save(update_fields=['attempts'])

    if not otp_obj.is_valid():
        return Response({'error': 'OTP has expired or too many attempts. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    if otp_obj.otp != code:
        remaining = max(0, 5 - otp_obj.attempts)
        return Response({'error': f'Incorrect OTP. {remaining} attempt(s) remaining.'}, status=status.HTTP_400_BAD_REQUEST)

    otp_obj.verified = True
    otp_obj.save(update_fields=['verified'])

    return Response({'message': 'Email verified successfully. You may now complete registration.'}, status=status.HTTP_200_OK)
