# Come to Chutneys (C2C) — Reimagined Website

A framework-free, responsive website for Come to Chutneys in Cumming, Georgia. This redesign keeps the existing C2C green / gold identity and logo while introducing a more editorial, premium South Indian visual system.

## What changed

- Rebuilt hero with custom dosa artwork, live open/closed status and stronger order CTAs
- New C2C signature-dishes section
- Custom vector graphics for dosa, idli, chutney flight and filter coffee
- Chutney-focused brand story section
- Searchable full menu with category tabs
- New editorial gallery/moodboard instead of placeholder gradient tiles
- Redesigned catering section and event poster
- Upgraded location/hours section and responsive map treatment
- Improved mobile navigation and sticky Call / Order / Directions bar
- Scroll-reveal motion, animated marquee and subtle interactive hero movement
- Reduced-motion support and semantic accessibility improvements

## Structure

```text
come-to-chutneys-main/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   ├── logo-banner.png
│   ├── logo-header.png
│   ├── logo-mark.png
│   └── graphics/
│       ├── dosa-plate.svg
│       ├── idli-stack.svg
│       ├── chutney-flight.svg
│       ├── filter-coffee.svg
│       └── pattern.svg
└── README.md
```

## Run locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

The site remains fully static and can be deployed to GitHub Pages, Netlify, Vercel, AWS S3/CloudFront, or any basic web host.

## Notes

- Menu prices/content were preserved from the supplied project.
- Restaurant phone, location, hours, Toast ordering, Google Maps and Instagram links remain integrated.
- All new food illustrations are local SVG assets, so the visual experience does not depend on stock-photo hosting.
