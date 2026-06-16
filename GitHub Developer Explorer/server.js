const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// In-memory cache for GitHub API data
// Keys: username (lowercase)
// Values: { data, timestamp }
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Store active rate limit info received from GitHub headers
let globalRateLimit = {
    remaining: null,
    reset: null
};

// Deterministic language colors (from GitHub standard colors)
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Ruby': '#701516',
    'PHP': '#4F5D95',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'Shell': '#89e051'
};

function getLanguageColor(lang) {
    if (!lang) return '#858585';
    if (LANGUAGE_COLORS[lang]) return LANGUAGE_COLORS[lang];
    
    // Hash function for fallback colors
    let hash = 0;
    for (let i = 0; i < lang.length; i++) {
        hash = lang.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 65%, 50%)`;
}

// API endpoint to fetch and transform developer details
app.get('/api/developer/:username', async (req, res) => {
    const username = req.params.username.trim().toLowerCase();
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // 1. Check cache first
    const cached = cache.get(username);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`[Cache Hit] Serving fresh cached data for ${username}`);
        return res.json({ ...cached.data, fromCache: true });
    }

    // 2. Build headers (use token if available in env)
    const headers = {
        'User-Agent': 'GitHub-Developer-Explorer-NodeJS',
        'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
        console.log(`[API Fetch] Fetching profile for ${username}...`);
        
        // Fetch User Profile
        const profileRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
        
        // Update rate limits from response headers
        updateRateLimits(profileRes.headers);

        if (profileRes.status === 404) {
            return res.status(404).json({ error: 'User Not Found' });
        }

        if (profileRes.status === 403 && globalRateLimit.remaining === 0) {
            console.warn(`[Rate Limit] Hit limit on profile fetch for ${username}`);
            // Attempt to serve stale cache
            if (cached) {
                console.log(`[Fallback Cache] Serving stale cache due to rate limit for ${username}`);
                return res.json({ ...cached.data, fromCache: true, rateLimited: true, resetTime: globalRateLimit.reset });
            }
            return res.status(429).json({ 
                error: 'Rate Limit Exceeded', 
                rateLimited: true, 
                resetTime: globalRateLimit.reset 
            });
        }

        if (!profileRes.ok) {
            throw new Error(`GitHub Profile API returned status ${profileRes.status}`);
        }

        const profile = await profileRes.json();

        // Fetch repositories (up to 3 pages / 300 repos to respect limits)
        let repos = [];
        let page = 1;
        let fetchMore = true;

        while (fetchMore && page <= 3) {
            console.log(`[API Fetch] Fetching repos page ${page} for ${username}...`);
            const reposRes = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`,
                { headers }
            );

            updateRateLimits(reposRes.headers);

            if (reposRes.status === 403 && globalRateLimit.remaining === 0) {
                console.warn(`[Rate Limit] Hit limit on repos fetch page ${page}`);
                break; // Return whatever repos we got so far, or fail
            }

            if (!reposRes.ok) {
                console.warn(`[API Error] Failed to fetch repos page ${page}`);
                break; 
            }

            const pageRepos = await reposRes.json();
            if (!Array.isArray(pageRepos) || pageRepos.length === 0) {
                fetchMore = false;
            } else {
                repos = repos.concat(pageRepos);
                if (pageRepos.length < 100) fetchMore = false;
                page++;
            }
        }

        // 3. Data Transformation
        // Clean profile details
        const cleanProfile = {
            avatar_url: profile.avatar_url,
            name: profile.name || profile.login,
            login: profile.login,
            html_url: profile.html_url,
            bio: profile.bio || null,
            location: profile.location || null,
            company: profile.company || null,
            blog: profile.blog || null,
            twitter_username: profile.twitter_username || null,
            followers: profile.followers,
            following: profile.following,
            public_repos: profile.public_repos
        };

        // Clean repositories list (remove heavy fields)
        const cleanRepos = repos.map(repo => ({
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description || null,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            size: repo.size, // in KB
            language: repo.language || null,
            updated_at: repo.updated_at
        }));

        // Compute total stars
        const totalStars = cleanRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

        // Compute language breakdown
        const langCounts = {};
        let totalLangRepos = 0;

        cleanRepos.forEach(repo => {
            if (repo.language) {
                langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                totalLangRepos++;
            }
        });

        const languages = Object.entries(langCounts)
            .map(([name, count]) => {
                const percentage = totalLangRepos > 0 ? parseFloat(((count / totalLangRepos) * 100).toFixed(1)) : 0;
                return {
                    name,
                    count,
                    percentage,
                    color: getLanguageColor(name)
                };
            })
            .sort((a, b) => b.count - a.count);

        // Form aggregate data object
        const transformedData = {
            profile: cleanProfile,
            stats: {
                totalStars
            },
            languages,
            repos: cleanRepos,
            rateLimit: globalRateLimit
        };

        // Cache the transformed data
        cache.set(username, {
            data: transformedData,
            timestamp: Date.now()
        });

        return res.json({ ...transformedData, fromCache: false });

    } catch (error) {
        console.error(`[Error] Failed to process request for ${username}:`, error);
        
        // Return stale cache if error occurs
        if (cached) {
            console.log(`[Fallback Cache] Serving stale cache due to server exception for ${username}`);
            return res.json({ ...cached.data, fromCache: true, errorOccured: true });
        }

        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

function updateRateLimits(responseHeaders) {
    const remaining = responseHeaders.get('x-ratelimit-remaining');
    const reset = responseHeaders.get('x-ratelimit-reset');
    
    if (remaining !== null) {
        globalRateLimit.remaining = parseInt(remaining, 10);
    }
    if (reset !== null) {
        globalRateLimit.reset = parseInt(reset, 10); // Unix timestamp
    }
}

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` GitHub Developer Explorer running on port ${PORT}`);
    console.log(` Open: http://localhost:${PORT}`);
    console.log(`====================================================`);
});
