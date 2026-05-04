import base64
import io
from PIL import Image
import logging

logger = logging.getLogger(__name__)

def compress_image_base64(base64_string, max_size=(1024, 1024), quality=75):
    """
    Takes a base64 string, decodes it, resizes it if needed, 
    compresses it as WebP, and returns the new base64 string.
    """
    if not base64_string or not base64_string.startswith('data:image/'):
        return base64_string

    try:
        # Split the header and the actual base64 data
        header, encoded = base64_string.split(',', 1)
        image_data = base64.b64decode(encoded)
        
        # Open image
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary (to save as JPEG/WebP)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Resize if larger than max_size while maintaining aspect ratio
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to a buffer with compression
        buffer = io.BytesIO()
        # Using WebP for superior compression, fallback to JPEG if needed
        img.save(buffer, format="WEBP", quality=quality, method=6)
        
        # Encode back to base64
        compressed_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/webp;base64,{compressedBase64}"
        
    except Exception as e:
        logger.error(f"Error compressing image: {e}")
        return base64_string
