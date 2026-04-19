# Live Telecast Server (LTS) Architecture Map

This document outlines the entire architecture of the Live Telecast Server (LTS) system, detailing its specific internal elements, styling approach, dynamic scripts, and how it connects to the broader website ecosystem.

## 📁 1. Core LTS HTML Pages (frontend/lts/)

The LTS subsystem operates independently from the main website navigation, with custom-designed monolithic interfaces to maximize performance and visual focus during live streams.

- **`lts-index.html`**: The main LTS Dashboard / Hub. Displays categorized grids for Live Now, Upcoming, and Ended podcast sessions.
- **`lts-join.html`**: The Waiting Room / Registration page. Authenticates users via cookie generation, checks browser compatibility, and displays countdowns for upcoming streams.
- **`lts-room.html`**: The actual Broadcast Interface. Contains the video grid, chat UI mockups, and "Attention check" popups.

## 🎨 2. Styling (CSS)

Unlike the main global portfolio which relies heavily on `../css/styles.css`, the LTS system utilizes **Independent Component Styling**.
- All three HTML pages contain dedicated, embedded `<style>` blocks specifically engineered for deep-dark UI, glassmorphism, and stream functionality. 
- **CSS Variables Used**: `--lts-primary`, `--lts-accent`, `--lts-live`, `--lts-upcoming`, `--lts-ended`, `--lts-card`.
- **External CDN Links**: Google Fonts (Outfit) and FontAwesome v6.4.0.

## ⚙️ 3. JavaScript & Logic

The LTS runs on three layers of logic:

- **`lts-podcasts.js` (Local)**:
  - Fetches the raw scheduling data for podcasts.
  - Dynamically calculates if a podcast is `upcoming`, `live`, or `ended` based on a 3-hour broadcast window.
  - Exposes the data globally to `window.LTS_PODCASTS` and triggers an `ltsDataReady` event.
  
- **`../logic/time_sync.js` (Shared External)**:
  - Critical dependency. Bootstraps immediately on page load to ping `worldtimeapi.org`.
  - Calculates the strict online UTC offset to prevent users from altering their device time to spoof event accessibility. 
  - Provides `window.getSyncedDate()`.

- **Inline Page Scripts**:
  - `lts-index.html`, `lts-join.html`, and `lts-room.html` contain massive inline `<script>` blocks (e.g. 100+ lines) handling proprietary UI DOM manipulation such as chat simulations, countdown timers, and rendering `ltsDataReady` payloads.

## 💾 4. Data Sources

- **`../data/lts_podcasts.json`**: The absolute Single Source of Truth for podcast data. Contains ID, Title, Guest Name, Date, Time, Registration Links, and Passwords.

## 🕸️ 5. Inbound/Outbound Connected Ecosystem Pages

The LTS doesn't exist in a vacuum; it intrinsically ties back to the main static architecture:
- **`biography.html`**: The Biography page connects to the entire LTS system.
- **`../logic/biography_library.js`**: Re-imports the `time_sync` duration logic and directly queries `../data/lts_podcasts.json` to embed the LTS podcast history natively into the Biography interface for visitors to see past and future broadcasts dynamically!
