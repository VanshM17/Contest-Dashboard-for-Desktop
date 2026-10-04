// User's Codeforces handle(you should edit it to your own handle to get personalized contest recommendations)
const CF_HANDLE = 'vanshmaheshwari';

// Define colors for each site to be used in the contest cards
const SITE_COLORS = {
    'Codeforces': 'var(--cf)',
    'LeetCode': 'var(--lc)',
    'AtCoder': 'var(--ac)',
    'CodeChef': 'var(--cc)'
};


//To get the user's rating from Codeforces API based on the provided handle
async function getUserRating(handle) {
    try {
        const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const data = await res.json();
        if (data.status === 'OK' && data.result.length > 0) {
            return data.result[0].rating || 0;
        }
    } catch (e) {
        console.error('Failed to fetch rating:', e);
    }
    return 0;
}
    // Determines if a Codeforces contest is eligible based on its name and the user's rating.
function isEligibleContest(contestName, rating) {
    const nameLower = contestName.toLowerCase();
    if (nameLower.includes('div. 1 + div. 2') || nameLower.includes('global') || nameLower.includes('educational')) {
        return true;
    }
    if (nameLower.includes('div. 1') && !nameLower.includes('div. 2')) {
        return rating >= 1900;
    }
    return true;
}
    // Fetches upcoming Codeforces contests and filters them based on the user's rating.
async function fetchCodeforces(userRating) {
    try {
        const res = await fetch('https://codeforces.com/api/contest.list');
        const data = await res.json();
        if (data.status !== 'OK') return [];

        return data.result
            .filter(c => (c.phase === 'BEFORE' || c.phase === 'CODING'))
            .filter(c => isEligibleContest(c.name, userRating))
            .map(c => ({
                site: 'Codeforces',
                name: c.name,
                start_time: c.startTimeSeconds * 1000,
                is_live: c.phase === 'CODING',
                url: `https://codeforces.com/contest/${c.id}`
            }));
    } catch (e) {
        return [];
    }
}

// Fetches upcoming contests from LeetCode and CodeChef using a community API named CompeteAPI.
async function fetchLeetCodeAndCodeChef() {
    try {
        const res = await fetch('https://competeapi.vercel.app/contests/upcoming/');
        const data = await res.json();
        const now = Date.now();

        return data
            .filter(c => c.site === 'leetcode' || c.site === 'codechef')
            .map(c => ({
                site: c.site === 'leetcode' ? 'LeetCode' : 'CodeChef',
                name: c.title,
                start_time: c.startTime,
                is_live: c.startTime <= now && now < c.endTime,
                url: c.url
            }));
    } catch (e) {
        console.error('Failed to fetch LeetCode/CodeChef contests:', e);
        return [];
    }
}

// Fetches upcoming AtCoder contests from a community API named Contest Hive and filters them based on contest type.
async function fetchAtCoder() {
    try {
        const res = await fetch('https://contest-hive.vercel.app/api/atcoder');
        const data = await res.json();
        if (!data.ok) return [];
        const now = Date.now();

        return data.data
            .filter(c => /Beginner Contest|Regular Contest|Grand Contest/i.test(c.title))
            .map(c => {
                const start = new Date(c.startTime).getTime();
                const end = new Date(c.endTime).getTime();
                return {
                    site: 'AtCoder',
                    name: c.title,
                    start_time: start,
                    is_live: start <= now && now < end,
                    url: c.url
                };
            })
            .slice(0, 5);
    } catch (e) {
        console.error('Failed to fetch AtCoder contests:', e);
        return [];
    }
}

    // Fetches all contests from CF, LC, CC, and AC & sorts them by start time, and displays them in the dashboard.
async function fetchAllContests() {
    const listElement = document.getElementById('contest-list');
    const userRating = await getUserRating(CF_HANDLE);

    const [cfContests, lcCcContests, atContests] = await Promise.all([
        fetchCodeforces(userRating),
        fetchLeetCodeAndCodeChef(),
        fetchAtCoder()
    ]);

    let allContests = [...cfContests, ...lcCcContests, ...atContests];
    allContests.sort((a, b) => a.start_time - b.start_time);

    listElement.innerHTML = '';

    allContests.slice(0, 9).forEach(contest => {
        const card = document.createElement('div');
        card.className = 'contest-card';
        card.style.setProperty('--site-color', SITE_COLORS[contest.site] || 'var(--cf)');

        const url = contest.url || '#';
        card.addEventListener('click', () => window.open(url, '_blank', 'noopener'));

        const startTime = new Date(contest.start_time).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
            // Escapes HTML special characters to prevent XSS and display issues.
        card.innerHTML = `
            <div class="contest-card-header">
                <span class="site-tag"><span class="site-dot"></span>${contest.site}</span>
                <span class="status-badge ${contest.is_live ? 'live' : ''}">
                    ${contest.is_live ? '<span class="pulse-dot"></span>LIVE' : 'UPCOMING'}
                </span>
            </div>
            <div class="contest-title" title="${escapeHtml(contest.name)}">${escapeHtml(contest.name)}</div>
            <div class="contest-footer">
                <span class="contest-time">${startTime}</span>
                <span class="go-arrow">Open &#8599;</span>
            </div>
        `;
        listElement.appendChild(card);
    });
}
    // Escapes HTML special characters to prevent XSS and display issues.
function escapeHtml(str) {
    return String(str || '').replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
    // Initial fetch and set up periodic refresh
fetchAllContests();
setInterval(fetchAllContests, 60 * 60 * 1000);