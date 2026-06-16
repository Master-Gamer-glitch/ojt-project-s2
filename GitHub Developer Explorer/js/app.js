// GitHub Developer Explorer - Client Logic

let activeData = null; // Store current search payload
let visibleCount = 12; // Simple pagination limit

// DOM Selectors
const DOM = {
    searchForm: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput'),
    rateLimitBanner: document.getElementById('rateLimitBanner'),
    resetTime: document.getElementById('resetTime'),
    
    emptyState: document.getElementById('emptyState'),
    errorState: document.getElementById('errorState'),
    loadingState: document.getElementById('loadingState'),
    resultsView: document.getElementById('resultsView'),
    
    // Profile
    avatar: document.getElementById('userAvatar'),
    name: document.getElementById('userName'),
    login: document.getElementById('userLogin'),
    bio: document.getElementById('userBio'),
    location: document.getElementById('userLocation'),
    company: document.getElementById('userCompany'),
    blog: document.getElementById('userBlog'),
    twitter: document.getElementById('userTwitter'),
    
    // Stats
    followers: document.getElementById('statFollowers'),
    following: document.getElementById('statFollowing'),
    reposCount: document.getElementById('statRepos'),
    stars: document.getElementById('statStars'),
    
    // Languages
    langBar: document.getElementById('languageBar'),
    langLegend: document.getElementById('languageLegend'),
    
    // Repos
    grid: document.getElementById('reposGrid'),
    repoSearch: document.getElementById('repoSearch'),
    repoLanguageFilter: document.getElementById('repoLanguageFilter'),
    repoSort: document.getElementById('repoSort'),
    loadMoreBtn: document.getElementById('loadMoreBtn')
};

// Show a specific view state
function showState(stateName) {
    DOM.emptyState.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
    DOM.loadingState.classList.add('hidden');
    DOM.resultsView.classList.add('hidden');
    
    if (stateName === 'empty') DOM.emptyState.classList.remove('hidden');
    else if (stateName === 'error') DOM.errorState.classList.remove('hidden');
    else if (stateName === 'loading') DOM.loadingState.classList.remove('hidden');
    else if (stateName === 'results') DOM.resultsView.classList.remove('hidden');
}

// Format size helper
function formatKB(kb) {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

// Format date helper
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Main search handler
async function handleSearch(e) {
    if (e) e.preventDefault();
    const username = DOM.searchInput.value.trim();
    if (!username) return;
    
    showState('loading');
    DOM.rateLimitBanner.classList.add('hidden');
    
    try {
        const response = await fetch(`/api/developer/${encodeURIComponent(username)}`);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch developer details');
        }
        
        activeData = result;
        visibleCount = 12; // Reset pagination
        
        // Show rate limit banner if remaining is low
        if (result.rateLimit && result.rateLimit.remaining === 0) {
            const resetDate = new Date(result.rateLimit.reset * 1000);
            DOM.resetTime.textContent = resetDate.toLocaleTimeString();
            DOM.rateLimitBanner.classList.remove('hidden');
        }
        
        // Populate profile fields
        DOM.avatar.src = result.profile.avatar_url;
        DOM.name.textContent = result.profile.name;
        DOM.login.textContent = `@${result.profile.login}`;
        DOM.login.href = result.profile.html_url;
        
        // Bio
        if (result.profile.bio) {
            DOM.bio.textContent = result.profile.bio;
            DOM.bio.classList.remove('hidden');
        } else {
            DOM.bio.classList.add('hidden');
        }
        
        // Helper for optional fields
        const setOptional = (element, val, isLink = false) => {
            if (val) {
                element.classList.remove('hidden');
                if (isLink) {
                    const a = element.querySelector('a');
                    a.href = val.startsWith('http') ? val : `https://${val}`;
                    a.textContent = val.replace(/^https?:\/\//, '');
                } else {
                    element.querySelector('.text').textContent = val;
                }
            } else {
                element.classList.add('hidden');
            }
        };
        
        setOptional(DOM.location, result.profile.location);
        setOptional(DOM.company, result.profile.company);
        setOptional(DOM.blog, result.profile.blog, true);
        setOptional(DOM.twitter, result.profile.twitter_username ? `twitter.com/${result.profile.twitter_username}` : null, true);
        
        // Stats
        DOM.followers.textContent = result.profile.followers.toLocaleString();
        DOM.following.textContent = result.profile.following.toLocaleString();
        DOM.reposCount.textContent = result.profile.public_repos.toLocaleString();
        DOM.stars.textContent = result.stats.totalStars.toLocaleString();
        
        // Populate Languages filters
        let langOptions = '<option value="all">All Languages</option>';
        result.languages.forEach(lang => {
            langOptions += `<option value="${lang.name}">${lang.name}</option>`;
        });
        DOM.repoLanguageFilter.innerHTML = langOptions;
        
        // Render Language breakdown
        renderLanguageBar(result.languages);
        
        // Reset controls
        DOM.repoSearch.value = '';
        DOM.repoLanguageFilter.value = 'all';
        DOM.repoSort.value = 'updated-desc';
        
        // Apply filters to initial state & render repos
        applyFiltersAndRender();
        showState('results');
        
    } catch (err) {
        document.getElementById('errorTitle').textContent = err.message === 'User Not Found' ? 'User Not Found' : 'Error Occurred';
        document.getElementById('errorMessage').textContent = err.message || 'Could not load profile. Please try again.';
        showState('error');
    }
}

// Render minimalist horizontal language segment bar
function renderLanguageBar(languages) {
    DOM.langBar.innerHTML = '';
    DOM.langLegend.innerHTML = '';
    
    if (languages.length === 0) {
        DOM.langBar.innerHTML = `<div style="width: 100%; text-align: center; color: #555; font-size: 0.85rem; padding: 0.5rem 0;">No language data</div>`;
        return;
    }
    
    languages.forEach(lang => {
        // Bar segments
        const segment = document.createElement('div');
        segment.className = 'lang-segment';
        segment.style.width = `${lang.percentage}%`;
        segment.style.backgroundColor = lang.color;
        segment.title = `${lang.name}: ${lang.percentage}%`;
        DOM.langBar.appendChild(segment);
        
        // Legend items
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <span class="legend-color" style="background-color: ${lang.color}"></span>
            <span>${lang.name} <span class="legend-pct">${lang.percentage}%</span></span>
        `;
        DOM.langLegend.appendChild(item);
    });
}

// Filter and Sort repositories on the client side
function applyFiltersAndRender() {
    if (!activeData || !activeData.repos) return;
    
    const searchTerm = DOM.repoSearch.value.trim().toLowerCase();
    const langFilter = DOM.repoLanguageFilter.value;
    const sortVal = DOM.repoSort.value;
    
    // Filter
    let filtered = activeData.repos.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm) || 
                              (repo.description && repo.description.toLowerCase().includes(searchTerm));
        const matchesLang = langFilter === 'all' || repo.language === langFilter;
        return matchesSearch && matchesLang;
    });
    
    // Sort
    filtered.sort((a, b) => {
        if (sortVal === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortVal === 'forks') return b.forks_count - a.forks_count;
        if (sortVal === 'size') return b.size - a.size;
        if (sortVal === 'name') return a.name.localeCompare(b.name);
        if (sortVal === 'updated-asc') return new Date(a.updated_at) - new Date(b.updated_at);
        return new Date(b.updated_at) - new Date(a.updated_at); // updated-desc default
    });
    
    // Paginate repos
    const paginated = filtered.slice(0, visibleCount);
    
    // Render Repos grid
    DOM.grid.innerHTML = '';
    if (paginated.length === 0) {
        DOM.grid.innerHTML = `<div class="no-repos">No repositories found</div>`;
        DOM.loadMoreBtn.classList.add('hidden');
        return;
    }
    
    paginated.forEach(repo => {
        const card = document.createElement('article');
        card.className = 'repo-card';
        card.innerHTML = `
            <div class="repo-card-header">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
                <span class="repo-visibility">Public</span>
            </div>
            <p class="repo-desc">${repo.description || 'No description provided.'}</p>
            <div class="repo-meta">
                ${repo.language ? `
                    <span class="repo-lang">
                        <span class="lang-color" style="background-color: ${activeData.languages.find(l => l.name === repo.language)?.color || '#555'}"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                <span class="repo-stat">★ ${repo.stargazers_count.toLocaleString()}</span>
                <span class="repo-stat">🔀 ${repo.forks_count.toLocaleString()}</span>
                <span class="repo-stat">📦 ${formatKB(repo.size)}</span>
                <span class="repo-updated">${formatDate(repo.updated_at)}</span>
            </div>
        `;
        DOM.grid.appendChild(card);
    });
    
    // Show/Hide Load More Button
    if (visibleCount < filtered.length) {
        DOM.loadMoreBtn.classList.remove('hidden');
    } else {
        DOM.loadMoreBtn.classList.add('hidden');
    }
}

// Event Listeners setup
function setupEvents() {
    DOM.searchForm.addEventListener('submit', handleSearch);
    
    // Live search (debounced slightly via timeout)
    let searchTimeout;
    DOM.repoSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            visibleCount = 12; // Reset pagination count on filter change
            applyFiltersAndRender();
        }, 150);
    });
    
    DOM.repoLanguageFilter.addEventListener('change', () => {
        visibleCount = 12;
        applyFiltersAndRender();
    });
    
    DOM.repoSort.addEventListener('change', () => {
        visibleCount = 12;
        applyFiltersAndRender();
    });
    
    DOM.loadMoreBtn.addEventListener('click', () => {
        visibleCount += 12;
        applyFiltersAndRender();
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    
    // Pre-populate input if URL contains a query param
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');
    if (user) {
        DOM.searchInput.value = user;
        handleSearch();
    }
});