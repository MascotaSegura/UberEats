import os
from PIL import Image
from collections import deque

def remove_background(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Visited set for BFS
    visited = set()
    queue = deque()
    
    # Initialize BFS with all border pixels
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(1, height - 1):
        queue.append((0, y))
        queue.append((width - 1, y))
        
    def is_background_color(r, g, b):
        # Checkerboard colors are either light gray (~190) or white/off-white (~240+)
        # We check if it is highly desaturated (gray/white)
        # tolerance for desaturation
        max_diff = max(abs(r - g), abs(r - b), abs(g - b))
        if max_diff > 12:
            return False
            
        # Check if it falls into light gray or white range
        # Usually checkerboard gray is ~180-200, white is ~240-255.
        # We can just say any desaturated pixel above 160 is background.
        avg = (r + g + b) / 3
        if avg >= 160:
            return True
            
        return False

    background_pixels = set()
    
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        
        r, g, b, a = pixels[x, y]
        if is_background_color(r, g, b):
            background_pixels.add((x, y))
            # Add neighbors
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        queue.append((nx, ny))
                        
    # Apply transparency to detected background pixels
    for x, y in background_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    img.save(output_path, "PNG")
    print(f"Processed {image_path} -> {output_path}")
    print(f"Removed {len(background_pixels)} background pixels.")

# Test on one image first
base_dir = r"c:\Users\DELL\Documents\Food\public\images"
input_img = os.path.join(base_dir, "promo_coffee_1784353040606.png")
output_img = os.path.join(base_dir, "promo_coffee_test_transparent.png")
remove_background(input_img, output_img)
