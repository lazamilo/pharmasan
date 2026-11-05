# Pharmasan redesign

A front-end pitch redesign of [pharmasan.si](https://pharmasan.si/): static HTML, CSS and JS with GSAP, ScrollTrigger and Lenis (vendored in `site/assets/js/vendor/`).

## Pages
- `site/index.html`: home (built from `index.src.html`)
- `site/about.html`, `site/inquiry.html`, `site/contact.html`, `site/news.html`

## Run locally
```bash
cd site && python3 -m http.server 4810
```
Then open http://localhost:4810.

After editing `site/index.src.html`, rebuild `index.html` (this inlines the Europe dot map from `assets/img/europe.svg`):
```bash
cd site && node build.mjs
```

## Fonts
The design uses **Maison Neue** (Book, Medium, Demi) and **Maison Neue Mono** (Regular). These are commercial fonts and are not included in this repo. Place the licensed `.otf` files in `site/assets/fonts/`:
`MaisonNeue-Book.otf`, `MaisonNeue-Medium.otf`, `MaisonNeue-Demi.otf`, `MaisonNeueMono-Regular.otf`.
Without them the site falls back to Helvetica Neue / Arial.

## Images
- Logo and original photography: from pharmasan.si (`site/assets/img/`).
- Generated stills: Higgsfield, Nano Banana 2.1 (`site/assets/img/hf/`, see `SOURCES.md` there).
- `source/`: crawled pages and original images from the current site, for reference.

## Notes
- The forms show a thank-you state but are not wired to a backend.
- The temperature chart is an illustrative animation, not live data.
- Pages carry `noindex` while this is a pitch.
