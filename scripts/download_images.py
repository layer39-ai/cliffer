import os
import time
import urllib.request
from duckduckgo_search import DDGS

# Define the queries for each image category
queries = {
    # Doors
    "sliding_doors": "luxury modern sliding glass doors exterior house",
    "casement_doors": "modern upvc casement glass door exterior",
    "french_doors": "luxury modern french glass doors exterior home",
    "villa_doors": "luxury large villa entrance double glass doors exterior",
    "arch_doors": "arched glass double doors exterior house modern",
    
    # Windows
    "sliding_windows": "modern sliding glass windows exterior house",
    "casement_windows": "modern upvc casement glass windows exterior house",
    "villa_windows": "luxury large villa windows exterior glass",
    "arch_windows": "arched glass windows modern house exterior",
    "tilt_and_turn_windows": "tilt and turn upvc glass window modern",
    
    # Other sections
    "hero_image": "modern luxury house with large glass windows and doors exterior",
    "split_doors": "modern house with large glass doors exterior",
    "split_windows": "modern house with large glass windows exterior"
}

output_dir = "assets/images/cliffer/new"
os.makedirs(output_dir, exist_ok=True)

def download_image(query, filename):
    print(f"Searching for: {query}")
    try:
        with DDGS() as ddgs:
            # Get 5 images and try to download the first one that works
            results = list(ddgs.images(query, max_results=5, type_image='photo'))
            for res in results:
                image_url = res['image']
                print(f"Found URL: {image_url}")
                try:
                    req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        ext = image_url.split('.')[-1].split('?')[0].lower()
                        if ext not in ['jpg', 'jpeg', 'png', 'webp', 'avif']:
                            ext = 'jpg' # fallback
                        
                        file_path = os.path.join(output_dir, f"{filename}.{ext}")
                        with open(file_path, "wb") as f:
                            f.write(response.read())
                        print(f"Successfully downloaded to {file_path}")
                        return f"new/{filename}.{ext}" # Return relative path
                except Exception as e:
                    print(f"Failed to download {image_url}: {e}")
                    continue
    except Exception as e:
        print(f"Search failed for {query}: {e}")
    return None

import json
image_paths = {}

for key, query in queries.items():
    path = download_image(query, key)
    if path:
        image_paths[key] = path
    time.sleep(2) # rate limit

with open("scripts/image_mapping.json", "w") as f:
    json.dump(image_paths, f, indent=4)
    
print("Done!")
