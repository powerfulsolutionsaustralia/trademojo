#!/usr/bin/env python3
"""Generate favicon.ico and icon.png from mojo.png source image."""

import sys
import os
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(PROJECT_ROOT, 'public', 'mojo.png')
FAVICON_OUT = os.path.join(PROJECT_ROOT, 'src', 'app', 'favicon.ico')
ICON_OUT = os.path.join(PROJECT_ROOT, 'src', 'app', 'icon.png')
APPLE_ICON_OUT = os.path.join(PROJECT_ROOT, 'src', 'app', 'apple-icon.png')

if not os.path.exists(SOURCE):
    print(f"Error: Source image not found at {SOURCE}")
    print("Please save the Mojo koala image to public/mojo.png first.")
    sys.exit(1)

img = Image.open(SOURCE)

# Convert to RGBA if needed
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Generate favicon.ico (16x16, 32x32, 48x48)
sizes = [(16, 16), (32, 32), (48, 48)]
icons = []
for size in sizes:
    resized = img.resize(size, Image.LANCZOS)
    icons.append(resized)

icons[0].save(FAVICON_OUT, format='ICO', sizes=sizes, append_images=icons[1:])
print(f"Generated: {FAVICON_OUT}")

# Generate icon.png (32x32 for browser tab)
icon_32 = img.resize((32, 32), Image.LANCZOS)
icon_32.save(ICON_OUT, format='PNG')
print(f"Generated: {ICON_OUT}")

# Generate apple-icon.png (180x180)
apple_icon = img.resize((180, 180), Image.LANCZOS)
apple_icon.save(APPLE_ICON_OUT, format='PNG')
print(f"Generated: {APPLE_ICON_OUT}")

print("\nDone! Favicon and icons generated from mojo.png.")
