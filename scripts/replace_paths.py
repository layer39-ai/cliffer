import os
import glob

replacements = {
    "assets/images/cliffer/hero.webp": "assets/images/cliffer/new/hero_image.jpg",
    "assets/images/cliffer/1.png": "assets/images/cliffer/new/slidingdoors.jpg",
    "assets/images/cliffer/2.png": "assets/images/cliffer/new/casementdoors.jpg",
    "assets/images/cliffer/3.png": "assets/images/cliffer/new/frenchdoors.jpg",
    "assets/images/cliffer/villadoors/villadoor1.avif": "assets/images/cliffer/new/villadoors.jpg",
    "assets/images/cliffer/archdoors/arched-window-1617877565-5783132.jpeg": "assets/images/cliffer/new/archdoors.png",
    "assets/images/cliffer/1.jpg": "assets/images/cliffer/new/slidingwindows.jpg",
    "assets/images/cliffer/2.jpg": "assets/images/cliffer/new/casementwindows.jpg",
    "assets/images/cliffer/3.jpg": "assets/images/cliffer/new/villawindows.jpg",
    "assets/images/cliffer/4.jpg": "assets/images/cliffer/new/archwindows.jpg",
    "assets/images/cliffer/5.jpg": "assets/images/cliffer/new/tiltandturn.png",
    "assets/images/cliffer/UPVC-Windows-and-Doors-Improve-Home-Security.png": "assets/images/cliffer/new/split_doors.jpg",
    "assets/images/cliffer/villawindows/4.webp": "assets/images/cliffer/new/split_windows.jpg"
}

html_files = glob.glob("*.html") + glob.glob("doors/*.html") + glob.glob("windows/*.html")

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old_path, new_path in replacements.items():
        if old_path in content:
            content = content.replace(old_path, new_path)
            modified = True
            
    if modified:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {html_file}")

print("All replacements done!")
