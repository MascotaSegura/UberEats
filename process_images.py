from rembg import remove
from PIL import Image
import os

images = [
    "promo_coffee_1784353040606.png",
    "promo_uber_one_1784353050268.png",
    "promo_movie_night_1784353056823.png",
    "promo_midnight_1784353064576.png"
]

base_dir = r"c:\Users\DELL\Documents\Food\public\images"

for img_name in images:
    input_path = os.path.join(base_dir, img_name)
    output_path = os.path.join(base_dir, img_name.replace(".png", "_transparent.png"))
    
    try:
        input_img = Image.open(input_path)
        print(f"Processing {img_name}...")
        output_img = remove(input_img)
        output_img.save(output_path, "PNG")
        print(f"Saved {output_path}")
        
        # Verify RGBA
        verify = Image.open(output_path)
        print(f"Mode for {img_name}: {verify.mode}")
    except Exception as e:
        print(f"Error processing {img_name}: {e}")
