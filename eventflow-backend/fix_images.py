import os
import django
import urllib.request
import urllib.error

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventflow_backend.settings')
django.setup()

from api.models import Event

def fix_images():
    events = Event.objects.all()
    fixed_count = 0
    
    for event in events:
        if event.image_url:
            try:
                # Add a User-Agent to avoid 403s just in case
                req = urllib.request.Request(
                    event.image_url, 
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                urllib.request.urlopen(req)
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    print(f"Broken image found for '{event.title}'. Removing image_url to trigger fallback.")
                    event.image_url = ""
                    event.save()
                    fixed_count += 1
            except Exception as e:
                print(f"Other error for '{event.title}': {e}")
                
    print(f"Fixed {fixed_count} broken event images.")

if __name__ == '__main__':
    fix_images()
