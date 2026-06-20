# 26 Studio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Now-C9A86A?style=for-the-badge&logo=github)](https://johnsonl111.github.io/interactive-3d-devin-worldcup-model/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r165-black?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> A real-time 3D showcase of the Vancouver FIFA World Cup 2026 Host City Kit concept. Explore every design detail of the jersey and shorts in an immersive, interactive experience — drag, flip, zoom, and discover the story woven into every stitch.

![Kit Viewer Demo](docs/demo.gif)

> **To generate the GIF:** Open the live app at `localhost:5173`, record a ~6 second screen capture showing the auto-rotate, a flip, and a hotspot zoom using [ScreenToGif](https://www.screentogif.com/) or Xbox Game Bar (`Win+G`), then save it to `docs/demo.gif`.

---

## Overview

The **Vancouver 2026 Kit Viewer** is a web-based 3D product experience built to bring a football kit concept to life. Rather than static flat renders, this viewer lets you physically rotate the jersey and shorts, flip between front and back, and tap interactive hotspots that zoom the camera directly into the design detail — complete with a description panel covering materials, techniques, and the inspiration behind each element.

The design is inspired by Vancouver's natural identity: cherry blossoms in spring, the Coast Mountains, Pacific Ocean currents, and the Sea to Sky Highway connecting Vancouver, Squamish, and Whistler.

---

## Features

- **Real-time 3D rendering** — Procedurally generated jersey and shorts geometry rendered with Three.js, with physically-based materials, multi-point lighting, and fabric-accurate roughness
- **Front & back flip** — Animated 180° Y-axis rotation reveals the full back panel with its own distinct design: Sea to Sky route line, coordinate tag, and reflective spine strip
- **Synchronized rotation** — Jersey and shorts share the same rotation state; dragging or flipping one moves both in perfect sync
- **Interactive hotspot dots** — Gold dots mark key design features on both front and back. Click any dot to zoom the camera smoothly into that area and open a detail panel
- **Zoom & detail panel** — Camera eases in toward the selected feature, pausing auto-rotation. Closing the panel eases the camera back out
- **Procedural canvas textures** — All jersey and shorts textures are painted in real time using the HTML5 Canvas API — no external image assets required. Design elements include:
  - Cherry blossom branch with individual petal blossoms
  - Three-layer Coast Mountain silhouettes with atmospheric depth
  - Gold topographic wave lines
  - Raindrop mesh pattern
  - Reflective hem and spine strips
  - Sea to Sky dashed route line with city markers
  - GPS coordinate woven tag (49.2827° N, 123.1207° W)
- **Auto-rotate** — Gentle idle rotation resumes automatically after 2 seconds of inactivity
- **Drag to rotate** — Full mouse and touch pointer support for manual rotation on any axis
- **Responsive layout** — Fills the viewport on any screen size

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | [React 18](https://react.dev/) |
| 3D Rendering | [Three.js r165](https://threejs.org/) |
| Texturing | HTML5 Canvas API (procedural, no image files) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Language | JavaScript (ES Modules) |
| Styling | Inline React styles |

---

## Project Structure

```
src/
├── App.jsx               # Root layout, shared rotation state, flip/zoom wiring
├── JerseyViewer3D.jsx    # 3D jersey — geometry, textures, hotspots, camera zoom
├── ShortsViewer3D.jsx    # 3D shorts — geometry, textures, hotspots
├── DetailPanel.jsx       # Slide-in detail panel for hotspot content
└── hotspotData.js        # Content for all hotspot detail panels
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch. The live demo will be available at:
`https://johnsonl111.github.io/interactive-3d-devin-worldcup-model/`

> Make sure GitHub Pages is enabled in your repo settings under **Settings → Pages → Source → gh-pages branch**.

---

## Design Inspiration

The Vancouver 2026 kit concept draws from the city's unique identity at the intersection of nature and urban life:

| Element | Inspiration |
|---|---|
| **Cherry Blossoms** | Renewal, community, and Vancouver's iconic spring |
| **Coast Mountains** | Three-layer silhouette reflecting the literal geography |
| **Ocean Wave Lines** | Pacific tidal currents rendered in gold thread |
| **Sea to Sky Route** | The highway connecting Vancouver → Squamish → Whistler |
| **Coordinate Tag** | 49.2827° N, 123.1207° W — Vancouver city centre |
| **Reflective Hem & Spine** | Player visibility and safety in low light |
| **Gold Maple Leaf** | Canada's national emblem, embroidered front and back |
| **V-Collar** | Modern athletic cut with gold satin trim |
| **Raindrop Mesh** | Ventilation pattern inspired by Vancouver rainfall |

### Colour Palette

| Name | Hex |
|---|---|
| Fog White | `#F2F3F0` |
| Coast Grey | `#9BAABB` |
| Pacific Blue | `#0A2A5E` |
| Deep Navy | `#061830` |
| Gold Accent | `#C9A86A` |
| Sakura Pink | `#F0B8C8` |

---

## Hotspot Reference

### Jersey — Front
| Dot | Feature |
|---|---|
| Cherry Blossoms | Sakura branch cascading from the left shoulder |
| Maple Leaf | Gold embroidered Canadian emblem, right chest |
| V-Collar | Gold-trimmed V-insert collar |
| Coast Mountains | Three-depth topographic mountain silhouettes |
| Ocean Waves | Gold tidal wave lines across the lower jersey |
| Reflective Hem | Retroreflective safety band at the hem |

### Jersey — Back
| Dot | Feature |
|---|---|
| Spine Strip | Full-length retroreflective strip |
| Sea to Sky Route | Dashed gold line: Vancouver → Squamish → Whistler |
| Coordinate Tag | Woven GPS label: 49.2827° N, 123.1207° W |

### Shorts — Front
| Dot | Feature |
|---|---|
| Cherry Blossom Detail | Sakura branch at the lower-left leg |
| Squad Number "26" | Gold FIFA World Cup 2026 edition number |
| Topographic Waves | Matching gold wave lines |
| Reflective Hem | Retroreflective hem band |

### Shorts — Back
| Dot | Feature |
|---|---|
| Back Maple Leaf | Gold maple leaf centred on the waistband |
| Reflective Hem | Retroreflective hem band |

---

## Controls

| Action | Result |
|---|---|
| Drag | Rotate jersey and shorts |
| Click a dot | Zoom in + open detail panel |
| Close panel / drag | Zoom back out |
| Flip ↺ button | Animate front → back (or back → front) |

---

*Vancouver 2026 · FIFA World Cup Host City Kit Concept · Rooted Here. Moving Together.*
