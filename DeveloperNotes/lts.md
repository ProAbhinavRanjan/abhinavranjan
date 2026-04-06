# LTS Platform — Live Telecast Server

The **Live Telecast Server (LTS)** is a specialized sub-platform within the Abhinav Ranjan portfolio designed for live-streaming podcasts, interactive Q&A sessions, and private room discussions.

---

## 1. Core Architecture
The LTS platform is a **data-driven "Single Page" application** (split into three HTML entry points) that operates independently of the main portfolio's `script_v105.js`.

- **Entry Point:** `lts-index.html` (LTS Homepage)
- **Join Flow:** `lts-join.html` (Interactive Step-by-Step wizard)
- **Live Room:** `lts-room.html` (The "Theater" experience)

---

## 2. Key Modules & Logic
### 🎙️ Podcast Management: `lts-podcasts.js`
A specialized fetcher that loads `lts_podcasts.json` into a global `window.LTS_PODCASTS` array. It is the **single source of truth** for all session data (ID, Status, Password).

### 🕒 Time Sync: `time_sync.js`
Critical for accurate session status. It calls `WorldTimeAPI` (UTC) to calculate a `timeOffset` relative to the local system clock.
- **Functions:** `window.getSyncedDate()` (Adjusted timestamp) and `window.isTimeSynced()`.

---

## 3. The Interactive Join Flow (`lts-join.html`)
A 7-step wizard built with interactive JavaScript:
1. **Lookup:** Validates the Podcast ID from `LTS_PODCASTS`.
2. **Validation:** Checks if the session is "Live" or "Ended" and if the device metadata (`attendement`) is supported.
3. **Security:** Enforces password entry for private rooms.
4. **Registration:** For "Upcoming" sessions, it saves user registry data via cookies (`lts_reg_id`, `lts_reg_name`).
5. **Session:** Redirects users to the live room via `sessionStorage` tokenization.

---

## 4. The Theatre Experience (`lts-room.html`)
- **Video Grid:** A responsive CSS grid mixing real-time `video-tile` elements (for the user) and simulated participant tiles.
- **Controls:** Includes functional (simulated) toggles for Mic, Camera, Raise Hand, Chat, and Info.
- **Overlay System:** Supports a "Host Suspended Session" overlay driven by the `attention` flag in the JSON data.

---

## 5. Summary Table
| File | Responsibility |
|---|---|
| `lts-index.html` | Displays Live, Upcoming, and Past sessions in a grid. |
| `lts-join.html` | Step-by-step room join and registration logic. |
| `lts-room.html` | Optimized for low-latency visual performance (simulated). |
| `lts_podcasts.json` | JSON database for all LTS sessions. |

---

## Optimization & Next Steps
- ✅ **Dark-Futuristic UI:** Specialized CSS variables and glassmorphism.
- ✅ **Device Support Checking:** Blocks incompatible devices via `attendement` metadata.
- ⚠️ **WebRTC Ready:** The UI and participant logic are structured for future live streaming integration.
