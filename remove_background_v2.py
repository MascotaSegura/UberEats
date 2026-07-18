import os
from PIL import Image
from collections import deque

def remove_checkerboard(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Visited set for BFS
    visited = set()
    queue = deque()
    
    # Define profiles
    # Gray background squares: typically around 185-205, desaturated
    def is_gray_bg(r, g, b):
        return (180 <= r <= 210 and 
                180 <= g <= 210 and 
                180 <= b <= 210 and 
                max(abs(r - g), abs(r - b), abs(g - b)) <= 8)
                
    # White background squares: typically 240-255, desaturated
    def is_white_bg(r, g, b):
        return (235 <= r <= 255 and 
                235 <= g <= 255 and 
                235 <= b <= 255 and 
                max(abs(r - g), abs(r - b), abs(g - b)) <= 8)

    # 1. Seed the queue with all pixels that match the gray background profile
    print("Finding seed pixels...")
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if is_gray_bg(r, g, b):
                queue.append((x, y))
                visited.add((x, y))

    print(f"Found {len(queue)} seed pixels. Starting BFS...")
    
    background_pixels = set()
    
    # 2. BFS to expand to adjacent gray or white background pixels
    while queue:
        x, y = queue.popleft()
        background_pixels.add((x, y))
        
        # Check 4-neighbors
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    nr, ng, nb, na = pixels[nx, ny]
                    if is_gray_bg(nr, ng, nb) or is_white_bg(nr, ng, nb):
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # 3. Apply transparency to detected background pixels
    for x, y in background_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    img.save(output_path, "PNG")
    print(f"Processed {image_path} -> {output_path}")
    print(f"Removed {len(background_pixels)} background pixels.")

# Process all 4 images
base_dir = r"c:\Users\DELL\Documents\Food\public\images"
images = [
    ("promo_coffee_1784353040606.png", "promo_coffee_transparent.png"),
    ("promo_uber_one_1784353050268.png", "promo_uber_one_transparent.png"),
    ("promo_movie_night_1784353056823.png", "promo_movie_night_transparent.png"),
    ("promo_midnight_1784353064576.png", "promo_midnight_transparent.png")
]

for src, dest in images:
    src_path = os.path.join(base_dir, src)
    dest_path = os.path.join(base_dir, dest)
    if os.path.exists(src_path):
        remove_checkerboard(src_path, dest_path)
    else:
        print(f"File not found: {src_path}")
