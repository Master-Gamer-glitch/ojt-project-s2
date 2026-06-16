import { getLanguageColor } from './utils.js';

const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

let globalRateLimit = {
    remaining: null,
    reset: null
};

try {
    const savedLimit = localStorage.getItem('githubRateLimit');
    if (savedLimit) {
        globalRateLimit = JSON.parse(savedLimit);
    }
} catch (e) {}

function updateRateLimits(responseHeaders) {
    const remaining = responseHeaders.get('x-ratelimit-remaining');
    const reset = responseHeaders.get('x-ratelimit-reset');
    let updated = false;
    
    if (remaining !== null) {
        globalRateLimit.remaining = parseInt(remaining, 10);
        updated = true;
    }
    if (reset !== null) {
        globalRateLimit.reset = parseInt(reset, 10);
        updated = true;
    }

    if (updated) {
        try {
            localStorage.setItem('githubRateLimit', JSON.stringify(globalRateLimit));
        } catch (e) {}
    }
}

export function getRateLimit() {
    return globalRateLimit;
}

export async function fetchDeveloperDetails(username) {
    username = username.trim().toLowerCase();
    if (!username) {
        throw new Error('Username is required');
    }

    const cached = cache.get(username);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return { ...cached.data, fromCache: true };
    }

    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };

    try {
        const profileRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
        updateRateLimits(profileRes.headers);

        if (profileRes.status === 404) {
            throw new Error('User Not Found');
        }

        if (profileRes.status === 403 && globalRateLimit.remaining === 0) {
            if (cached) {
                return { ...cached.data, fromCache: true, rateLimited: true, resetTime: globalRateLimit.reset };
            }
            throw new Error('Rate Limit Exceeded');
        }

        if (!profileRes.ok) {
            throw new Error(`GitHub Profile API returned status ${profileRes.status}`);
        }

        const profile = await profileRes.json();

        let repos = [];
        let page = 1;
        let fetchMore = true;

        while (fetchMore && page <= 3) {
            const reposRes = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`,
                { headers }
            );

            updateRateLimits(reposRes.headers);

            if (reposRes.status === 403 && globalRateLimit.remaining === 0) {
                break;
            }

            if (!reposRes.ok) {
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

        const cleanRepos = repos.map(repo => ({
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description || null,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            size: repo.size,
            language: repo.language || null,
            updated_at: repo.updated_at
        }));

        const totalStars = cleanRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

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

        const transformedData = {
            profile: cleanProfile,
            stats: { totalStars },
            languages,
            repos: cleanRepos,
            rateLimit: globalRateLimit
        };

        cache.set(username, {
            data: transformedData,
            timestamp: Date.now()
        });

        return { ...transformedData, fromCache: false };

    } catch (error) {
        if (cached) {
            return { ...cached.data, fromCache: true, errorOccured: true };
        }
        throw error;
    }
}
