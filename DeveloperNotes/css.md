# Styling & Design System

This document outlines the visual architecture of the Abhinav Ranjan portfolio, built using **Vanilla CSS3** with a focus on modern, premium aesthetics.

---

## 1. Core Styles: `styles.css`
The **global design system** (4000+ lines). It handles 100% of the styling except for small internal overrides in specialized pages.

- **Design Philosophy:** 
    - **Glassmorphism:** Uses `backdrop-filter: blur()` and semi-transparent backgrounds for a high-end feel.
    - **Dark-First:** Primarily designed for a dark blue-black environment (`#050505`) with a light mode toggle.
    - **Vivid Accents:** Prominent use of **Royal Blue** (`#6366f1`) and **Indigo** (`#8b5cf6`).
- **Responsive Design:** 
    - Mobile-first approach with custom hamburger menu transitions.
    - Flexible grid layouts (`projects-grid`, `socials-grid`, `winnings-grid`).
- **Animations:** 
    - **Entrance:** `fade-in-up` class driven by Intersection Observer.
    - **Interactive:** `3D Tilt` effect on all `.card` elements.
    - **Glow Effects:** `glowing-orb` and `lts-live-dot` pulsing animations.

---

## 2. Page-Specific CSS
While centered in `styles.css`, certain pages use unique internal overrides:

- **Legal Pages:** Styled specifically for long-form readability using the `legal-content` class.
- **Offline Page:** Contains **100% internal CSS** to ensure the page renders correctly when the user is completely disconnected.
- **LTS Section:** Uses a localized variation of the "Premium Loading Screen" to match the dark-futuristic podcaster aesthetic.

---

## 3. Component Breakdown
| Component | Key Styles / Features |
|---|---|
| **Header** | Fixed position, backdrop-blur, active state tracking. |
| **Loader** | Full-screen overlay, pulsing text, animated dual-color spinner. |
| **Cards** | Border-radius (16px), scale-on-hover, gradient project fallbacks. |
| **Modals** | Blur-backdrop, entry-scale animation, responsive centering. |
| **Forms** | Focus-glow, custom transition for input focuses. |

---

## 4. Key Performance Points
- ✅ **Vanilla CSS:** No heavy frameworks (Tailwind/Bootstrap), keeping page weight low.
- ✅ **Google Fonts:** Preconnected for fast typography loading.
- ✅ **Variable-Driven:** Color, spacing, and transition durations are defined globally at the `:root` level.
- ⚠️ **CSS Variables:** Extensive use of CSS variables facilitates quick theme adjustments but requires modern browser support.
