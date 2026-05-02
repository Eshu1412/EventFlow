import requests
import base64
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

class ResendHTTPEmailBackend(BaseEmailBackend):
    """
    A custom email backend for Django that uses the Resend REST API (HTTP) 
    instead of SMTP. This bypasses the port 587 blocking on Render free tiers.
    """
    def send_messages(self, email_messages):
        if not email_messages:
            return 0
            
        num_sent = 0
        api_url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {settings.EMAIL_HOST_PASSWORD}",
            "Content-Type": "application/json"
        }

        for message in email_messages:
            from_email = message.from_email or settings.DEFAULT_FROM_EMAIL
            
            # Determine HTML content if it exists
            html_content = ""
            text_content = message.body
            
            if hasattr(message, 'alternatives') and message.alternatives:
                for alt_content, mimetype in message.alternatives:
                    if mimetype == "text/html":
                        html_content = alt_content
                        break
            
            if not html_content and hasattr(message, 'html_message'):
                html_content = message.html_message
                
            # If the body is actually HTML (which EmailMessage sets when content_subtype="html")
            if getattr(message, "content_subtype", "") == "html" and not html_content:
                html_content = message.body
                text_content = ""

            payload = {
                "from": from_email,
                "to": message.to,
                "subject": message.subject,
            }
            if html_content:
                payload["html"] = html_content
            if text_content:
                payload["text"] = text_content

            # Handle attachments
            if message.attachments:
                payload["attachments"] = []
                for attachment in message.attachments:
                    # Attachment is usually a tuple: (filename, content, mimetype)
                    if isinstance(attachment, tuple):
                        filename, content, mimetype = attachment
                    else:
                        filename = attachment.name
                        content = attachment.read()
                        mimetype = attachment.content_type

                    payload["attachments"].append({
                        "filename": filename,
                        "content": base64.b64encode(content).decode('utf-8')
                    })

            try:
                response = requests.post(api_url, json=payload, headers=headers, timeout=10)
                response.raise_for_status()
                num_sent += 1
            except Exception as e:
                if not self.fail_silently:
                    raise e
                    
        return num_sent
