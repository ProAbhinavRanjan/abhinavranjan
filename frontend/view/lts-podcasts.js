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

        // Renaming/mapping for internal consistency if needed, 
        // but the JSON already uses 'attendement'
        window.LTS_PODCASTS = data;

        // Dispatch event so HTML pages know data is ready
        window.dispatchEvent(new CustomEvent('ltsDataReady'));
    } catch (error) {
        console.error('🔴 LTS Data Error:', error);
        window.LTS_PODCASTS = [];
    }
})();

