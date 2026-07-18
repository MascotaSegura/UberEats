import os
import math
from PIL import Image
from collections import deque

def remove_checkerboard_advanced(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # 1. Identify all desaturated pixels
    # We define a pixel as desaturated if R, G, B are very close to each other.
    desat_mask = [[False for _ in range(height)] for _ in range(width)]
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            max_diff = max(abs(r - g), abs(r - b), abs(g - b))
            # Background is gray (~170-200) or white (~240-255).
            # We filter desaturated pixels with a brightness threshold.
            if max_diff <= 12 and (r + g + b) / 3 >= 120:
                desat_mask[x][y] = True

    # 2. Group desaturated pixels into connected components
    visited = [[False for _ in range(height)] for _ in range(width)]
    components = []
    
    for y in range(height):
        for x in range(width):
            if desat_mask[x][y] and not visited[x][y]:
                # Start a new component BFS
                comp = []
                queue = deque([(x, y)])
                visited[x][y] = True
                
                touches_border = False
                
                while queue:
                    cx, cy = queue.popleft()
                    comp.append((cx, cy))
                    
                    if cx == 0 or cx == width - 1 or cy == 0 or cy == height - 1:
                        touches_border = True
                        
                    for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                        if 0 <= nx < width and 0 <= ny < height:
                            if desat_mask[nx][ny] and not visited[nx][ny]:
                                visited[nx][ny] = True
                                queue.append((nx, ny))
                
                components.append({
                    "pixels": comp,
                    "touches_border": touches_border
                })

    print(f"Found {len(components)} desaturated components.")
    
    background_pixels = set()
    
    for idx, comp in enumerate(components):
        pixels_list = comp["pixels"]
        touches_border = comp["touches_border"]
        
        # If it touches the border, it's definitely part of the main background
        if touches_border:
            background_pixels.update(pixels_list)
            continue
            
        # If it doesn't touch the border, it is an island (e.g. straw, cream, or handle hole, donut hole)
        # We calculate the standard deviation of pixel values to detect the checkerboard pattern.
        # A checkerboard pattern alternates high (white ~240) and low (gray ~180) values, yielding a high std dev.
        # Cream and straw are smooth, yielding a low std dev.
        values = []
        for px, py in pixels_list:
            r, g, b, a = pixels[px, py]
            # grayscale value
            values.append(0.299 * r + 0.587 * g + 0.114 * b)
            
        if len(values) < 5:
            # Too small to be a background hole
            continue
            
        mean = sum(values) / len(values)
        variance = sum((v - mean) ** 2 for v in values) / len(values)
        std_dev = math.sqrt(variance)
        
        # Checkerboard has standard deviation of ~30 (alternating 255 and 190).
        # We set a threshold of 18.0.
        is_checkerboard_hole = std_dev > 15.0
        
        print(f"Island {idx}: size={len(pixels_list)}, std_dev={std_dev:.2f}, is_hole={is_checkerboard_hole}")
        
        if is_checkerboard_hole:
            background_pixels.update(pixels_list)

    # 3. Apply transparency to all detected background pixels
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
        remove_checkerboard_advanced(src_path, dest_path)
    else:
        print(f"File not found: {src_path}")
