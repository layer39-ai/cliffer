# Cliffer

Cliffer is a premium uPVC windows and doors business located in Vijayawada.

## Codebase Structure

```
cliffer/
├── index.html                  # Main homepage / landing page
├── doors/                      # Doors category pages (with Real Installations Galleries & Lightbox)
│   ├── archdoors.html
│   ├── casementdoors.html
│   ├── frenchdoors.html
│   ├── slidingdoors.html
│   └── villadoors.html
├── windows/                    # Windows category pages (with Real Installations Galleries & Lightbox)
│   ├── archwindows.html
│   ├── casementwindows.html
│   ├── slidingwindows.html
│   ├── tiltandturn.html
│   └── villawindows.html
├── assets/
│   ├── css/
│   │   └── style.css           # Global stylesheet + Gallery & Lightbox styles
│   ├── js/
│   │   └── script.js           # Interactive UI behaviours & Lightbox modal controller
│   └── images/
│       ├── doors/              # Category-specific real installation photos (arch, casement, etc.)
│       ├── windows/            # Category-specific real installation photos (sliding, tilt-turn, etc.)
│       ├── cliffer/            # Verified client partner logos
│       ├── hero_installation.jpg
│       ├── split_doors.jpg
│       └── split_windows.jpg
└── scripts/                    # Automation and utility scripts
    ├── download_bing.py
    ├── download_images.py
    ├── image_mapping.json
    └── replace_paths.py
```
