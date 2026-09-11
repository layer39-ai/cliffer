import os
import shutil
from bing_image_downloader import downloader

queries = {
    # Doors
    "slidingdoors": "luxury modern sliding glass doors exterior house",
    "casementdoors": "modern upvc casement glass door exterior",
    "frenchdoors": "luxury modern french glass doors exterior home",
    "villadoors": "luxury large villa entrance double glass doors exterior",
    "archdoors": "arched glass double doors exterior house modern",
    
    # Windows
    "slidingwindows": "modern sliding glass windows exterior house",
    "casementwindows": "modern upvc casement glass windows exterior house",
    "villawindows": "luxury large villa windows exterior glass",
    "archwindows": "arched glass windows modern house exterior",
    "tiltandturn": "tilt and turn upvc glass window modern",
    
    # Other sections
    "hero_image": "modern luxury house with large glass windows and doors exterior",
    "split_doors": "modern house with large glass doors exterior",
    "split_windows": "modern house with large glass windows exterior"
}

output_dir = "assets/images/cliffer/new"
os.makedirs(output_dir, exist_ok=True)
download_dir = "assets/images/cliffer/bing_downloads"

import json
image_paths = {}

for key, query in queries.items():
    print(f"Downloading for {key}...")
    try:
        downloader.download(query, limit=1, output_dir=download_dir, adult_filter_off=False, force_replace=False, timeout=10, verbose=False)
        
        # Find the downloaded file
        query_dir = os.path.join(download_dir, query)
        if os.path.exists(query_dir):
            files = os.listdir(query_dir)
            if files:
                file_name = files[0]
                ext = file_name.split('.')[-1].lower()
                new_file_name = f"{key}.{ext}"
                new_file_path = os.path.join(output_dir, new_file_name)
                
                shutil.copy(os.path.join(query_dir, file_name), new_file_path)
                image_paths[key] = f"new/{new_file_name}"
                print(f"Successfully copied to {new_file_path}")
    except Exception as e:
        print(f"Failed for {key}: {e}")

with open("scripts/image_mapping.json", "w") as f:
    json.dump(image_paths, f, indent=4)

print("Done!")
