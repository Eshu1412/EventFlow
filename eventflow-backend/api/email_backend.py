import requests
import logging
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

logger = logging.getLogger(__name__)


class EmailJSBackend(BaseEmailBackend):
    """
    Custom Django email backend that sends emails via the EmailJS REST API.
    Works on Render free tier (no SMTP port restrictions — pure HTTPS).

    Required settings (read from env via settings.py):
        EMAILJS_SERVICE_ID   — e.g. "service_aud0bch"
        EMAILJS_PUBLIC_KEY   — EmailJS public key (user_id)
        EMAILJS_PRIVATE_KEY  — EmailJS private key (accessToken)
        EMAILJS_TEMPLATE_ID  — Default template ID (must accept: to_email, subject, message_html)
    """

    EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send"

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        service_id = getattr(settings, "EMAILJS_SERVICE_ID", "")
        public_key = getattr(settings, "EMAILJS_PUBLIC_KEY", "")
        private_key = getattr(settings, "EMAILJS_PRIVATE_KEY", "")
        template_id = getattr(settings, "EMAILJS_TEMPLATE_ID", "")

        if not all([service_id, public_key, template_id]):
            logger.error("EmailJS is not fully configured. Check EMAILJS_SERVICE_ID, PUBLIC_KEY, TEMPLATE_ID.")
            if not self.fail_silently:
                raise ValueError("EmailJS is not fully configured.")
            return 0

        num_sent = 0

        for message in email_messages:
            # Extract HTML content
            html_content = ""
            text_content = message.body

            if hasattr(message, 'alternatives') and message.alternatives:
                for alt_content, mimetype in message.alternatives:
                    if mimetype == "text/html":
                        html_content = alt_content
                        break

            if getattr(message, "content_subtype", "") == "html" and not html_content:
                html_content = message.body
                text_content = ""

            # Build the template params
            to_email = message.to[0] if message.to else ""

            template_params = {
                "to_email": to_email,
                "email": to_email,
                "email_to": to_email,
                "reply_to": to_email,
                "subject": message.subject,
                "message_html": html_content or text_content,
                "message": html_content or text_content,
                "from_name": "EventFlow",
            }

            payload = {
                "service_id": service_id,
                "template_id": template_id,
                "user_id": public_key,
                "template_params": template_params,
            }

            if private_key:
                payload["accessToken"] = private_key

            try:
                response = requests.post(
                    self.EMAILJS_API_URL,
                    json=payload,
                    timeout=15,
                )

                if response.status_code == 200:
                    logger.info("Email sent via EmailJS to %s (subject: %s)", to_email, message.subject)
                    num_sent += 1
                else:
                    logger.error(
                        "EmailJS API error %s for to=%s: %s",
                        response.status_code, to_email, response.text
                    )
                    if not self.fail_silently:
                        response.raise_for_status()
            except requests.exceptions.RequestException as e:
                logger.error("EmailJS request failed for to=%s: %s", to_email, e)
                if not self.fail_silently:
                    raise e

        return num_sent


def send_email_via_emailjs(to_email, subject, html_body, text_body="", extra_params=None):
    """
    Standalone helper to send an email via EmailJS REST API.
    Used by views that construct their own HTML (OTP, password reset).
    extra_params: dict of additional template variables (e.g. passcode, time).
    Returns True on success, raises on failure.
    """
    service_id = getattr(settings, "EMAILJS_SERVICE_ID", "")
    public_key = getattr(settings, "EMAILJS_PUBLIC_KEY", "")
    private_key = getattr(settings, "EMAILJS_PRIVATE_KEY", "")
    template_id = getattr(settings, "EMAILJS_TEMPLATE_ID", "")

    template_params = {
        "to_email": to_email,
        "email": to_email,
        "email_to": to_email,
        "reply_to": to_email,
        "subject": subject,
        "message_html": html_body,
        "message": text_body or html_body,
        "from_name": "EventFlow",
    }

    # Merge any extra template variables (passcode, time, etc.)
    if extra_params:
        template_params.update(extra_params)

    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": public_key,
        "template_params": template_params,
    }

    if private_key:
        payload["accessToken"] = private_key

    response = requests.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        json=payload,
        timeout=15,
    )

    if response.status_code == 200:
        logger.info("EmailJS: sent to %s (subject: %s)", to_email, subject)
        return True
    else:
        logger.error("EmailJS error %s to=%s: %s", response.status_code, to_email, response.text)
        raise Exception(f"EmailJS API error {response.status_code}: {response.text}")
