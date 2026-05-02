# EventFlow Email Template

Single universal template for **all** EventFlow emails (OTP, password reset, booking confirmation).

## Setup in EmailJS Dashboard

1. Go to **Email Templates** → open `template_1hw1ee6`
2. Set these fields:
   - **To Email:** `{{to_email}}`
   - **Subject:** `{{subject}}`
   - **Content (body):** `{{{message_html}}}` ← **triple braces** (renders raw HTML)
3. Save

That's it. The backend sends the full styled HTML in `message_html`, so one template handles everything.
