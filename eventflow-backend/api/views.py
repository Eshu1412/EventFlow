"""
EventFlow API views — 100% Supabase SDK (no Django ORM).
Auth uses custom PyJWT + Supabase users table (api.supabase_auth).
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse
from . import supabase_ops as sb_ops
from . import supabase_auth as sb_auth
from .permissions import IsOrganizerOrAdmin, IsAdmin
import logging, json

logger = logging.getLogger(__name__)

# ── Auth ──────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    email = (data.get('email') or '').strip().lower()
    password = data.get('password', '')
    name = (data.get('name') or '').strip()
    role = data.get('role', 'user')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if sb_auth.user_exists(email):
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_409_CONFLICT)

    otp_record = sb_ops.get_latest_otp(email)
    if not otp_record or not otp_record.get('verified'):
        return Response({'error': 'Email not verified. Please verify your email with the OTP first.'}, status=status.HTTP_400_BAD_REQUEST)
    sb_ops.delete_otp(otp_record['id'])

    user = sb_auth.create_user(email, name, make_password(password), role)
    return Response({'message': 'Registered successfully', 'user': sb_auth.format_user(user)}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = (request.data.get('email') or '').strip().lower()
    password = request.data.get('password', '')
    user = sb_auth.get_user_by_email(email)
    if not user or not check_password(password, user.get('password', '')):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token = sb_auth.generate_access_token(user)
    return Response({'token': token, 'user': sb_auth.format_user(user)})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user  # SupabaseUser instance
    if request.method == 'GET':
        return Response(sb_auth.format_user(user))

    data = request.data
    updates = {}
    if 'name' in data:
        updates['name'] = data['name']
        user.name = data['name']
    if 'password' in data:
        updates['password'] = make_password(data['password'])
        user.password = updates['password']
    if 'role' in data and data['role'] in ['user', 'organizer', 'admin']:
        updates['role'] = data['role']
        user.role = data['role']
    if updates:
        sb_auth.update_user(user.id, updates)
    return Response(sb_auth.format_user(user))

# ── Events ────────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def events_list(request):
    if request.method == 'GET':
        events = sb_ops.get_all_events()
        return Response([sb_ops.format_event(e) for e in events])

    if not IsOrganizerOrAdmin().has_permission(request, None):
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    evt = sb_ops.create_event(request.data, request.user.id)
    if not evt:
        return Response({'error': 'Failed to create event'}, status=status.HTTP_400_BAD_REQUEST)
    full = sb_ops.get_event(evt['id'])
    return Response(sb_ops.format_event(full), status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def event_detail(request, pk):
    event = sb_ops.get_event(pk)
    if not event:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(sb_ops.format_event(event))

    if not request.user or not getattr(request.user, 'is_authenticated', False):
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    if not IsOrganizerOrAdmin().has_permission(request, None):
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    if event['organizer_id'] != request.user.id and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        sb_ops.update_event(pk, request.data)
        return Response(sb_ops.format_event(sb_ops.get_event(pk)))
    elif request.method == 'DELETE':
        sb_ops.delete_event(pk)
        return Response({'message': 'Event deleted'})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def event_reviews(request, pk):
    event = sb_ops.get_event(pk)
    if not event:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response([sb_ops.format_review(r) for r in sb_ops.get_event_reviews(pk)])

    if not request.user or not getattr(request.user, 'is_authenticated', False):
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    rv = sb_ops.create_review(request.user.id, pk, request.data.get('rating', 5), request.data.get('comment', ''))
    full = sb_ops.supabase.table("reviews").select("*, users!reviews_user_id_fkey(name)").eq("id", rv['id']).execute().data[0]
    return Response(sb_ops.format_review(full), status=status.HTTP_201_CREATED)

# ── Bookings ──────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_event(request):
    event_id = request.data.get('event_id')
    quantity = int(request.data.get('quantity', 1))
    event = sb_ops.get_event(event_id)
    if not event:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    if (event['total_seats'] - event['booked_seats']) < quantity:
        return Response({'error': 'Not enough seats available'}, status=status.HTTP_400_BAD_REQUEST)

    bk = sb_ops.create_booking(request.user.id, event_id, quantity)
    full_bk = sb_ops.get_booking(bk['id'])

    try:
        from .ticket_utils import send_ticket_email_supabase
        send_ticket_email_supabase(full_bk, request.user)
    except Exception as exc:
        logger.warning("Ticket email failed: %s", exc)

    return Response(sb_ops.format_booking(full_bk), status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    return Response([sb_ops.format_booking(b) for b in sb_ops.get_user_bookings(request.user.id)])


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, pk):
    bk = sb_ops.get_booking(pk)
    if not bk:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if bk['user_id'] != request.user.id:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    sb_ops.cancel_booking(pk)
    return Response({'message': 'Booking cancelled'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_ticket(request, pk):
    bk = sb_ops.get_booking(pk)
    if not bk:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    if bk['user_id'] != request.user.id and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    from .ticket_utils import generate_ticket_pdf_supabase
    pdf_buf = generate_ticket_pdf_supabase(bk, request.user)
    filename = f"EventFlow_Ticket_{bk['id']:06d}.pdf"
    response = HttpResponse(pdf_buf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response['Access-Control-Expose-Headers'] = 'Content-Disposition'
    return response

# ── Admin ─────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_users(request):
    users = sb_auth.get_all_users()
    return Response([sb_auth.format_user(u) for u in users])


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_manage_user(request, pk):
    user = sb_auth.get_user_by_id(pk)
    if not user:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        sb_auth.delete_user(pk)
        return Response({'message': 'User deleted'})
    data = request.data
    updates = {}
    if 'name' in data:
        updates['name'] = data['name']
    if 'role' in data and data['role'] in ['user', 'organizer', 'admin']:
        updates['role'] = data['role']
    if updates:
        sb_auth.update_user(pk, updates)
    updated = sb_auth.get_user_by_id(pk)
    return Response(sb_auth.format_user(updated))


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_events(request):
    return Response([sb_ops.format_event(e) for e in sb_ops.get_all_events()])


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_bookings(request):
    return Response([sb_ops.format_booking(b) for b in sb_ops.get_all_bookings()])


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_stats(request):
    return Response({
        'total_users': sb_auth.count_users(),
        'total_events': sb_ops.count_table("events"),
        'total_bookings': sb_ops.count_table("bookings"),
    })

# ── Organizer ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsOrganizerOrAdmin])
def organizer_bookings(request):
    return Response([sb_ops.format_booking(b) for b in sb_ops.get_organizer_bookings(request.user.id)])

# ── Password Reset ────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    from django.conf import settings
    from .email_backend import send_email_via_emailjs
    from django.utils import timezone
    from datetime import timedelta

    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = sb_auth.get_user_by_email(email)
    if not user:
        return Response({'message': 'If that email is registered, a reset link has been sent.'})

    existing = sb_ops.get_latest_unused_reset_token(user['id'])
    if existing:
        from dateutil.parser import parse as dtparse
        diff = timezone.now() - dtparse(existing['created_at'])
        if diff < timedelta(minutes=10):
            remaining = int((timedelta(minutes=10) - diff).total_seconds())
            return Response({'error': f'Please wait. Try again in {remaining//60}m {remaining%60}s.', 'remaining_seconds': remaining}, status=status.HTTP_429_TOO_MANY_REQUESTS)

    token_obj = sb_ops.create_reset_token(user['id'])
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token_obj['token']}"
    try:
        html_msg = f"""<p>Hi {user.get('name', email)},</p>
<p>We received a request to reset your EventFlow password. Click the button below to set a new password:</p>
<p><a href="{reset_url}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p><a href="{reset_url}">{reset_url}</a></p>
<p><small>This link expires in 1 hour.</small></p>"""
        text_msg = f"Reset your password by clicking this link:\n{reset_url}\n\nExpires in 1 hour."
        send_email_via_emailjs(to_email=email, subject="Reset your EventFlow password", html_body=html_msg,
            text_body=text_msg,
            extra_params={
                "title": "Reset your password",
                "description": f"Hi {user.get('name', email)}, click below to reset your password. Expires in 1 hour.",
                "link": reset_url,
                "url": reset_url,
                "reset_link": reset_url,
                "reset_url": reset_url,
                "token_link": reset_url,
                "button_url": reset_url,
                "action_url": reset_url,
                "button_text": "Reset Password",
                "message": f'Click this link to reset your password: <a href="{reset_url}">{reset_url}</a>',
                "message_html": f'<p>Click the link below to reset your password:</p><p><a href="{reset_url}">{reset_url}</a></p>',
            })
    except Exception as e:
        logger.warning("Password reset email failed: %s", e)
        if settings.DEBUG:
            return Response({'message': 'Dev mode: email not delivered.', 'reset_url': reset_url})
        return Response({'error': 'Failed to send reset email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'message': 'If that email is registered, a reset link has been sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    token_str = request.data.get('token', '').strip()
    new_password = request.data.get('password', '').strip()
    if not token_str or not new_password:
        return Response({'error': 'Token and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(new_password) < 6:
        return Response({'error': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    token_obj = sb_ops.get_reset_token(token_str)
    if not token_obj or token_obj.get('used'):
        return Response({'error': 'Invalid or expired reset link.'}, status=status.HTTP_400_BAD_REQUEST)

    from dateutil.parser import parse as dtparse
    from django.utils import timezone
    from datetime import timedelta
    if timezone.now() > dtparse(token_obj['created_at']) + timedelta(hours=1):
        return Response({'error': 'This reset link has expired.'}, status=status.HTTP_400_BAD_REQUEST)

    sb_auth.update_user(token_obj['user_id'], {'password': make_password(new_password)})
    sb_ops.mark_token_used(token_obj['id'])
    return Response({'message': 'Password reset successful.'})

# ── OTP Verification ─────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def check_email(request):
    email = (request.data.get('email') or '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'exists': sb_auth.user_exists(email)})


@api_view(['POST'])
@permission_classes([AllowAny])
def send_registration_otp(request):
    from django.conf import settings
    from .email_backend import send_email_via_emailjs
    from django.utils import timezone
    from datetime import timedelta
    import urllib.parse

    email = (request.data.get('email') or '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if sb_auth.user_exists(email):
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_409_CONFLICT)

    role = request.data.get('role', 'user')
    if role not in ['user', 'organizer', 'admin']:
        return Response({'error': 'Invalid user role.'}, status=status.HTTP_400_BAD_REQUEST)

    existing = sb_ops.get_latest_otp(email)
    if existing and not existing.get('verified'):
        from dateutil.parser import parse as dtparse
        diff = timezone.now() - dtparse(existing['created_at'])
        if diff < timedelta(minutes=10):
            remaining = int((timedelta(minutes=10) - diff).total_seconds())
            return Response({'error': f'Please wait. Try again in {remaining//60}m {remaining%60}s.', 'remaining_seconds': remaining}, status=status.HTTP_429_TOO_MANY_REQUESTS)

    pending = {'name': (request.data.get('name') or '').strip(), 'password': request.data.get('password', ''), 'role': role}
    otp_obj = sb_ops.generate_otp(email)
    sb_ops.update_otp(otp_obj['id'], {'pending_data': json.dumps(pending)})

    verify_url = f"{settings.FRONTEND_URL}/verify-email?email={urllib.parse.quote(email)}&otp={otp_obj['otp']}"
    try:
        html_msg = f"""<p>Hi,</p>
<p>Thank you for registering with EventFlow! Your One-Time Password (OTP) is:</p>
<h2 style="font-size:24px;letter-spacing:4px;color:#333;">{otp_obj['otp']}</h2>
<p>Or verify instantly by clicking the button below:</p>
<p><a href="{verify_url}" style="display:inline-block;padding:10px 20px;background-color:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p><a href="{verify_url}">{verify_url}</a></p>
<p><small>This code expires in 10 minutes.</small></p>"""
        text_msg = f"Your EventFlow OTP is: {otp_obj['otp']}\n\nOr verify instantly by clicking: {verify_url}\n\nExpires in 10 minutes."
        send_email_via_emailjs(to_email=email, subject="Verify your EventFlow account", html_body=html_msg,
            text_body=text_msg,
            extra_params={
                "title": "Verify your email",
                "description": f"Your OTP is {otp_obj['otp']}. Click below to verify. Expires in 10 minutes.",
                "link": verify_url,
                "url": verify_url,
                "verify_link": verify_url,
                "verify_url": verify_url,
                "action_url": verify_url,
                "button_text": "Verify Now",
                "otp": otp_obj['otp'],
                "message": f"Your OTP is: {otp_obj['otp']}. Click here to verify: {verify_url}",
                "message_html": f'<p>Your OTP is: <strong>{otp_obj["otp"]}</strong></p><p><a href="{verify_url}">Click here to verify</a></p>',
            })
    except Exception as e:
        logger.error("OTP email failed for %s: %s", email, e)
        if settings.DEBUG:
            return Response({'message': 'Dev mode: email not delivered.', 'dev_otp': otp_obj['otp']})
        return Response({'error': 'Failed to send verification email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'message': 'Verification email sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_registration_otp(request):
    email = (request.data.get('email') or '').strip().lower()
    code = (request.data.get('otp') or '').strip()
    if not email or not code:
        return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if sb_auth.user_exists(email):
        sb_ops.delete_otps_for_email(email)
        return Response({'message': 'Account already exists.', 'registered': False, 'already_exists': True})

    otp_obj = sb_ops.get_latest_otp(email)
    if not otp_obj:
        return Response({'error': 'No verification code found.'}, status=status.HTTP_400_BAD_REQUEST)

    if otp_obj.get('verified'):
        pending = _parse_pending(otp_obj)
        if pending and not sb_auth.user_exists(email):
            return _complete_registration(email, pending, otp_obj)
        sb_ops.delete_otp(otp_obj['id'])
        return Response({'message': 'Email already verified.', 'registered': False})

    attempts = otp_obj.get('attempts', 0) + 1
    sb_ops.update_otp(otp_obj['id'], {'attempts': attempts})

    from dateutil.parser import parse as dtparse
    from django.utils import timezone
    from datetime import timedelta
    created = dtparse(otp_obj['created_at'])
    if attempts >= 5 or timezone.now() > created + timedelta(minutes=10):
        return Response({'error': 'Code expired or too many attempts.'}, status=status.HTTP_400_BAD_REQUEST)
    if otp_obj['otp'] != code:
        return Response({'error': f'Incorrect code. {max(0,5-attempts)} attempt(s) remaining.'}, status=status.HTTP_400_BAD_REQUEST)

    sb_ops.update_otp(otp_obj['id'], {'verified': True})
    pending = _parse_pending(otp_obj)
    if pending:
        return _complete_registration(email, pending, otp_obj)
    return Response({'message': 'Email verified.', 'registered': False})


def _parse_pending(otp_obj):
    pd = otp_obj.get('pending_data')
    if pd:
        try: return json.loads(pd)
        except: pass
    return None


def _complete_registration(email, pending, otp_obj):
    password = pending.get('password', '')
    if not password:
        return Response({'message': 'Email verified but missing data.', 'registered': False})
    try:
        user = sb_auth.create_user(email, pending.get('name', ''), make_password(password), pending.get('role', 'user'))
        sb_ops.delete_otp(otp_obj['id'])
        token = sb_auth.generate_access_token(user)
        return Response({'message': 'Account created!', 'registered': True, 'user': sb_auth.format_user(user), 'token': token}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error("Registration failed for %s: %s", email, e)
        return Response({'error': 'Registration failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
