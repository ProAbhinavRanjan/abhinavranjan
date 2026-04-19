/**
 * lts-podcasts.js — Live Telecast Server | Podcast Data & Management
 * ===================================================================
 * This script now fetches data from frontend/data/lts_podcasts.json
 */

(async function () {
    try {
        const response = await fetch('../data/lts_podcasts.json');
        if (!response.ok) throw new Error('Failed to fetch podcast data');
        const data = await response.json();

        // Automatically determine status based on synced time
        function computeDynamicStatus(dateStr, timeStr) {
            if (!dateStr || !timeStr) return "ended";
            
            // Standardize time zones for robust parsing across browsers (e.g. IST -> GMT+0530)
            const timeReplaced = timeStr.replace(/IST/i, 'GMT+0530')
                                      .replace(/EST/i, 'GMT-0500')
                                      .replace(/PST/i, 'GMT-0800')
                                      .replace(/UTC/i, 'GMT');
            
            const eventTimeMs = Date.parse(`${dateStr} ${timeReplaced}`);
            if (isNaN(eventTimeMs)) return "ended"; // parsing fallback
            
            const durationMs = 3 * 60 * 60 * 1000; // 3 hours window for live
            const currentTimeMs = window.getSyncedDate ? window.getSyncedDate().getTime() : Date.now();
            
            if (currentTimeMs < eventTimeMs) return "upcoming";
            if (currentTimeMs >= eventTimeMs && currentTimeMs <= (eventTimeMs + durationMs)) return "live";
            return "ended";
        }

        data.forEach(p => {
            p.status = computeDynamicStatus(p.date, p.time);
        });

        window.LTS_PODCASTS = data;

        // Dispatch event so HTML pages know data is ready
        window.dispatchEvent(new CustomEvent('ltsDataReady'));
    } catch (error) {
        console.error('🔴 LTS Data Error:', error);
        window.LTS_PODCASTS = [];
    }
})();
