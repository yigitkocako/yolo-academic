YOLO Academic — Clean & Stable Build

This package is a clean, stable version of your site with:
- Consistent navbar on ALL pages (Home / Find / Results / Insights / About)
- Working TR/EN language toggle (persists via localStorage)
- Results debug banner removed (only visible with ?debug=1)
- Placeholder badge fixed (no more 'badge.placeholder' keys)
- Social icons (Instagram / YouTube / LinkedIn) added to the blue CTA section
- Hero slider supports ANY number of images (dots auto-create)

How to install (Windows):
1) Unzip this folder.
2) Replace your existing project folder with this one (or copy the files over).
3) Put your hero images into /assets:
   - hero-1.jpg
   - hero-2.jpg
   - hero-3.jpg
   (You can add more slides by adding more <div class="hero-slide"...> lines in index.html)

Important config:
- assets/config.js:
   calendlyUrl
   sheets.sheetId + universitiesGid
   socials.instagram / youtube / linkedin (add your links here)

Run locally:
- Open PowerShell in the project folder
- python -m http.server 8000
- Visit: http://localhost:8000

If you ever need diagnostics:
- Open: http://localhost:8000/results.html?debug=1
