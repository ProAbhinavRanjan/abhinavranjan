/**
 * lts-podcasts.js — Live Telecast Server | Podcast Data & Management
 * ===================================================================
 * Edit this file to manage all live podcasts.
 *
 * PODCAST VISIBILITY:
 *   type: "public"  — Anyone can join without a password
 *   type: "private" — User must enter a password to join
 *
 * PODCAST ATTENTION:
 *   attention: true  — Device connection enabled (can join room)
 *   attention: false — Room is suspended; shows "Device not supported / Trouble-shoot"
 *
 * STATUS:
 *   status: "live"     — Podcast is currently live
 *   status: "upcoming" — Not started yet
 *   status: "ended"    — Podcast has ended
 */

const LTS_PODCASTS = [
    {
        id: "PODCAST-IIT-01",
        title: "Cybersecurity & Young Innovators",
        host: "Abhinav Ranjan",
        description: "A special podcast session at IIT Madras discussing cybersecurity, innovation, and the future of young tech entrepreneurs.",
        date: "7 April 2026",
        time: "3:00 PM IST",
        thumbnail: "",                   // URL to thumbnail image (leave empty for gradient)
        type: "public",                  // "public" | "private"
        password: "",                    // Only used if type = "private"
        status: "upcoming",              // "live" | "upcoming" | "ended"
        attention: true,                 // true = allow join | false = device not supported
        maxParticipants: 100,
        chatEnabled: true
    },
    {
        id: "PODCAST-AR-02",
        title: "Ethical Hacking — Q&A Live",
        host: "Abhinav Ranjan",
        description: "An open Q&A session where Abhinav answers live questions about ethical hacking, cybersecurity careers, and responsible technology.",
        date: "15 March 2026",
        time: "7:00 PM IST",
        thumbnail: "",
        type: "private",                 // Password-protected room
        password: "hackitnow",           // Password required to join
        status: "live",
        attention: true,
        maxParticipants: 50,
        chatEnabled: true
    },
    {
        id: "PODCAST-DEMO-03",
        title: "Luminary Technicals — Vision 2030",
        host: "Abhinav Ranjan",
        description: "An exclusive preview of what Luminary Technicals is building for the next decade. Infrastructure, security, and innovation.",
        date: "1 March 2026",
        time: "6:00 PM IST",
        thumbnail: "",
        type: "public",
        password: "",
        status: "ended",
        attention: false,                // Device not supported — room suspended
        maxParticipants: 200,
        chatEnabled: false
    }
];

// Export for use in other pages
if (typeof window !== 'undefined') {
    window.LTS_PODCASTS = LTS_PODCASTS;
}
