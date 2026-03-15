/**
 * time_sync.js — LTS Platform | Online Time Synchronization
 * ==========================================================
 * Provides a reliable time source by syncing with an online API.
 * This prevents issues caused by incorrect local device clocks.
 */

(function () {
    let timeOffset = 0; // Difference in milliseconds between local and server time
    let isSynced = false;

    /**
     * Fetches current time from a public API and calculates the offset.
     */
    async function syncTime() {
        try {
            // WorldTimeAPI provides a simple JSON response with current Unix time
            const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
                method: 'GET',
                // Keep timeout short so we don't block the UI if API is slow/down
                signal: AbortSignal.timeout(3000)
            });

            if (!response.ok) throw new Error('Time API responded with error');

            const data = await response.json();
            const serverMillis = data.unixtime * 1000;
            const localMillis = Date.now();

            // Calculate offset: how much we need to add to local time to get server time
            timeOffset = serverMillis - localMillis;
            isSynced = true;

            console.log(`⏰ [TimeSync] Online time synced. Offset: ${timeOffset}ms`);
        } catch (error) {
            console.warn('⚠️ [TimeSync] Failed to sync with online time API. Falling back to local device clock.', error);
        }
    }

    /**
     * Returns a Date object representing the synchronized time.
     * @returns {Date}
     */
    window.getSyncedDate = function () {
        return new Date(Date.now() + timeOffset);
    };

    /**
     * Helper to check if time is currently synced.
     * @returns {boolean}
     */
    window.isTimeSynced = function () {
        return isSynced;
    };

    // Start sync immediately
    syncTime();
})();
