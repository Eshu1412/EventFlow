"""
ticket_utils.py — PDF ticket generation and email delivery for EventFlow.

Public API:
    generate_ticket_pdf(booking)  → BytesIO  (raw PDF bytes)
    send_ticket_email(booking)    → None     (sends email with PDF attachment)
"""

import io
import qrcode  # optional, falls back gracefully if not installed
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


# ── Brand colours ────────────────────────────────────────────────────────────
GOLD        = colors.HexColor("#b8924e")
GOLD_DARK   = colors.HexColor("#966a1e")
DARK_BG     = colors.HexColor("#0c0d0f")
CARD_BG     = colors.HexColor("#141518")
BORDER      = colors.HexColor("#2a2b2f")
WHITE       = colors.white
MUTED       = colors.HexColor("#888888")


def _draw_rounded_rect(c_obj, x, y, w, h, r, fill_color, stroke_color=None, stroke_width=1):
    """Draw a rectangle with rounded corners using Bezier curves."""
    c_obj.saveState()
    c_obj.setFillColor(fill_color)
    if stroke_color:
        c_obj.setStrokeColor(stroke_color)
        c_obj.setLineWidth(stroke_width)
    else:
        c_obj.setStrokeColor(fill_color)

    p = c_obj.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.curveTo(x + w, y, x + w, y, x + w, y + r)
    p.lineTo(x + w, y + h - r)
    p.curveTo(x + w, y + h, x + w, y + h, x + w - r, y + h)
    p.lineTo(x + r, y + h)
    p.curveTo(x, y + h, x, y + h, x, y + h - r)
    p.lineTo(x, y + r)
    p.curveTo(x, y, x, y, x + r, y)
    p.close()
    c_obj.drawPath(p, fill=1, stroke=1 if stroke_color else 0)
    c_obj.restoreState()


def _make_qr(data: str) -> io.BytesIO | None:
    """Generate a QR code image; returns BytesIO or None on failure."""
    try:
        import qrcode as qc
        qr = qc.QRCode(version=1, box_size=4, border=2,
                       error_correction=qc.constants.ERROR_CORRECT_M)
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#b8924e", back_color="#141518")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        return buf
    except Exception:
        return None


def generate_ticket_pdf(booking) -> io.BytesIO:
    """
    Build a premium A4 PDF ticket for the given Booking instance.
    Returns a BytesIO with the PDF data.
    """
    buf = io.BytesIO()
    W, H = A4          # 595.27 x 841.89 pt  ≈  210 x 297 mm

    c = canvas.Canvas(buf, pagesize=A4)
    c.setTitle(f"EventFlow Ticket — {booking.event.title}")
    c.setAuthor("EventFlow")

    # ── Full-page dark background ─────────────────────────────────────────
    c.setFillColor(DARK_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Header gradient band ──────────────────────────────────────────────
    header_h = 140
    # Simulate gradient with several layered rects
    steps = 30
    for i in range(steps):
        frac = i / steps
        r = 0xb8 + int((0x96 - 0xb8) * frac)
        g = 0x92 + int((0x6a - 0x92) * frac)
        b = 0x4e + int((0x1e - 0x4e) * frac)
        c.setFillColor(colors.Color(r/255, g/255, b/255))
        c.rect(0, H - header_h + (i * header_h / steps),
               W, header_h / steps + 1, fill=1, stroke=0)

    # Brand name
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(36, H - 56, "Event")
    c.setFillColor(DARK_BG)
    c.drawString(36 + c.stringWidth("Event", "Helvetica-Bold", 32), H - 56, "Flow")

    c.setFillColor(WHITE)
    c.setFont("Helvetica", 11)
    c.drawString(36, H - 76, "Your Official Event Ticket")

    # Ticket # (top-right)
    ticket_label = f"TICKET #{booking.id:06d}"
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(DARK_BG)
    c.drawRightString(W - 36, H - 52, ticket_label)

    c.setFont("Helvetica", 9)
    c.drawRightString(W - 36, H - 68, datetime.now().strftime("%d %b %Y  %H:%M"))

    # ── Main ticket card ──────────────────────────────────────────────────
    card_x, card_y = 30, 200
    card_w, card_h = W - 60, H - header_h - 230
    _draw_rounded_rect(c, card_x, card_y, card_w, card_h, 12,
                       fill_color=CARD_BG, stroke_color=BORDER, stroke_width=1)

    # Event title stripe inside card
    stripe_y = card_y + card_h - 70
    c.setFillColor(colors.HexColor("#1a1b1f"))
    c.rect(card_x, stripe_y, card_w, 70, fill=1, stroke=0)

    # Category badge
    cat = getattr(booking.event, "category", None) or "Event"
    badge_w = c.stringWidth(cat, "Helvetica-Bold", 9) + 16
    _draw_rounded_rect(c, card_x + 20, stripe_y + 42, badge_w, 18, 4,
                       fill_color=GOLD)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(DARK_BG)
    c.drawString(card_x + 28, stripe_y + 47, cat.upper())

    # Event title
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(WHITE)
    title = booking.event.title
    if c.stringWidth(title, "Helvetica-Bold", 20) > card_w - 40:
        # Truncate
        while c.stringWidth(title + "…", "Helvetica-Bold", 20) > card_w - 40:
            title = title[:-1]
        title += "…"
    c.drawString(card_x + 20, stripe_y + 15, title)

    # ── Detail rows ───────────────────────────────────────────────────────
    def _detail_row(label, value, y_pos):
        c.setFont("Helvetica", 8)
        c.setFillColor(MUTED)
        c.drawString(card_x + 20, y_pos + 12, label.upper())
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(WHITE)
        c.drawString(card_x + 20, y_pos - 2, str(value))

    event_date = booking.event.date
    if hasattr(event_date, "strftime"):
        date_str = event_date.strftime("%A, %d %B %Y")
        time_str = event_date.strftime("%I:%M %p")
    else:
        date_str = str(event_date)
        time_str = "—"

    col2_x = card_x + card_w // 2

    row1_y = stripe_y - 60
    _detail_row("📅  Date", date_str, row1_y)

    row2_y = row1_y - 55
    _detail_row("🕐  Time", time_str, row2_y)
    _detail_row("📍  Venue", booking.event.location or "TBA", row2_y)
    # Adjust x for second column
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(col2_x + 10, row2_y + 12, "📍  VENUE")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(WHITE)
    venue_text = booking.event.location or "TBA"
    c.drawString(col2_x + 10, row2_y - 2, venue_text)

    row3_y = row2_y - 55
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(card_x + 20, row3_y + 12, "👤  ATTENDEE")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(WHITE)
    c.drawString(card_x + 20, row3_y - 2, booking.user.name or booking.user.email)

    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(col2_x + 10, row3_y + 12, "✉️  EMAIL")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(WHITE)
    c.drawString(col2_x + 10, row3_y - 2, booking.user.email)

    row4_y = row3_y - 55
    price = booking.event.price or 0
    total = price * booking.quantity
    price_str = f"₹{total:,.2f} ({booking.quantity}x)" if price > 0 else f"FREE ({booking.quantity}x)"
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(card_x + 20, row4_y + 12, "💰  TOTAL PRICE")
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(GOLD)
    c.drawString(card_x + 20, row4_y - 4, price_str)

    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(col2_x + 10, row4_y + 12, "📋  STATUS")
    status_col = colors.HexColor("#22c55e") if booking.status == "confirmed" else colors.HexColor("#f87171")
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(status_col)
    c.drawString(col2_x + 10, row4_y - 2, booking.status.upper())

    # ── Dashed separator (tear-line) ─────────────────────────────────────
    sep_y = card_y + 110
    c.setStrokeColor(BORDER)
    c.setDash([4, 4], 0)
    c.setLineWidth(1)
    c.line(card_x + 10, sep_y, card_x + card_w - 10, sep_y)
    c.setDash([], 0)   # reset

    # Scissors icon
    c.setFont("Helvetica", 10)
    c.setFillColor(MUTED)
    c.drawCentredString(W / 2, sep_y + 4, "✂  ─────────────────── tear here ───────────────────  ✂")

    # ── QR Code ───────────────────────────────────────────────────────────
    qr_data = f"EVENTFLOW|BOOKING:{booking.id}|EVENT:{booking.event.id}|USER:{booking.user.id}"
    qr_buf = _make_qr(qr_data)
    qr_size = 80

    if qr_buf:
        qr_img = ImageReader(qr_buf)
        qr_x = card_x + card_w - qr_size - 20
        qr_y = card_y + 15
        # White BG for QR
        c.setFillColor(WHITE)
        c.rect(qr_x - 4, qr_y - 4, qr_size + 8, qr_size + 8, fill=1, stroke=0)
        c.drawImage(qr_img, qr_x, qr_y, qr_size, qr_size)

    # Booking ID large
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(GOLD)
    c.drawString(card_x + 20, card_y + 75, f"BOOKING ID")
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(WHITE)
    c.drawString(card_x + 20, card_y + 45, f"# {booking.id:06d}")
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(card_x + 20, card_y + 30, "Present this ticket at the venue entrance")

    # ── Footer ────────────────────────────────────────────────────────────
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawCentredString(W / 2, 30, "© 2025 EventFlow — Tushar Maurya — B.Tech IT Project  |  "
                                    "This ticket is non-transferable.")
    c.drawCentredString(W / 2, 18, f"Generated: {datetime.now().strftime('%d %b %Y %H:%M:%S')}")

    # Thin gold line above footer
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(36, 45, W - 36, 45)

    c.save()
    buf.seek(0)
    return buf


def send_ticket_email(booking) -> None:
    """
    Send the PDF ticket as an email attachment to the booking user.
    Raises on SMTP failure — caller should catch.
    """
    from django.core.mail import EmailMessage
    from django.conf import settings

    user  = booking.user
    event = booking.event

    event_date_str = ""
    if hasattr(event.date, "strftime"):
        event_date_str = event.date.strftime("%d %B %Y at %I:%M %p")

    html_body = f"""
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:580px;margin:0 auto;
                background:#0c0d0f;border:1px solid rgba(255,255,255,0.08);
                border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#b8924e,#966a1e);padding:32px 40px">
        <h1 style="margin:0;font-size:28px;letter-spacing:0.08em;color:#fff;font-weight:900">
          Event<span style="color:#0c0d0f">Flow</span>
        </h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">
          Your booking is confirmed!
        </p>
      </div>

      <div style="padding:40px">
        <h2 style="margin:0 0 8px;font-size:22px;color:#ffffff">
          🎟️ Your ticket is ready!
        </h2>
        <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.8;margin:0 0 28px">
          Hi <strong style="color:#fff">{user.name or user.email}</strong>, your booking for
          <strong style="color:#b8924e">{event.title}</strong> has been confirmed.<br/>
          Your ticket is attached to this email as a PDF. Please bring it (printed or digital)
          to the venue entrance.
        </p>

        <!-- Ticket summary card -->
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(184,146,78,0.25);
                    border-radius:12px;padding:24px;margin-bottom:28px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;
                         text-transform:uppercase;letter-spacing:0.08em;width:40%">Event</td>
              <td style="padding:6px 0;color:#fff;font-weight:600;font-size:14px">{event.title}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;
                         text-transform:uppercase;letter-spacing:0.08em">Date & Time</td>
              <td style="padding:6px 0;color:#fff;font-size:14px">{event_date_str or 'TBA'}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;
                         text-transform:uppercase;letter-spacing:0.08em">Venue</td>
              <td style="padding:6px 0;color:#fff;font-size:14px">{event.location or 'TBA'}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;
                         text-transform:uppercase;letter-spacing:0.08em">Booking ID</td>
              <td style="padding:6px 0;color:#b8924e;font-weight:700;font-size:14px">
                #{booking.id:06d}
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;
                         text-transform:uppercase;letter-spacing:0.08em">Quantity</td>
              <td style="padding:6px 0;color:#fff;font-weight:700;font-size:14px">
                {booking.quantity}
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;
                         text-transform:uppercase;letter-spacing:0.08em">Price</td>
              <td style="padding:6px 0;color:#b8924e;font-weight:700;font-size:14px">
                {'FREE' if not event.price else f'₹{event.price * booking.quantity:,.2f}'}
              </td>
            </tr>
          </table>
        </div>

        <p style="color:rgba(255,255,255,0.35);font-size:12px;line-height:1.7;margin:0">
          This ticket is non-transferable and valid for one entry only.<br/>
          For any queries, please contact the event organizer.
        </p>
      </div>

      <div style="background:#141518;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px">
          &copy; 2025 EventFlow &mdash; Tushar Maurya &mdash; B.Tech IT Project
        </p>
      </div>
    </div>
    """

    pdf_buf = generate_ticket_pdf(booking)

    email = EmailMessage(
        subject=f"🎟️ Your EventFlow Ticket — {event.title}",
        body=html_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.content_subtype = "html"
    email.attach(
        filename=f"EventFlow_Ticket_{booking.id:06d}.pdf",
        content=pdf_buf.read(),
        mimetype="application/pdf",
    )
    email.send(fail_silently=False)
