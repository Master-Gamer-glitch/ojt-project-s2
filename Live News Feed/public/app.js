const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const searchBtn = document.getElementById('search-btn');
const newsContainer = document.getElementById('news-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

async function fetchNews(query = '', category = 'all') {
    // Show spinner, hide errors and old data
    loadingSpinner.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    newsContainer.innerHTML = '';

    try {
        const url = new URL('/api/news', window.location.origin);
        if (query) url.searchParams.append('query', query);
        if (category) url.searchParams.append('category', category);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch news from server.');
        }

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message || 'Error from NewsAPI');
        }

        if (data.articles && data.articles.length > 0) {
            renderNews(data.articles);
        } else {
            showError("No articles found. Try a different search.");
        }

    } catch (error) {
        showError(error.message);
    } finally {
        // Hide spinner
        loadingSpinner.classList.add('hidden');
    }
}

function renderNews(articles) {
    articles.forEach(article => {
        // Skip removed articles
        if (!article.title || article.title === '[Removed]') return;

        const card = document.createElement('div');
        card.className = 'news-card';

        const date = new Date(article.publishedAt).toLocaleDateString();
        const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; // high-quality fallback

        card.innerHTML = `
            <img src="${imageUrl}" alt="News Image" class="news-image" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'">
            <div class="news-content">
                <div class="news-meta">
                    <span>${article.source.name || 'Unknown'}</span>
                    <span>${date}</span>
                </div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-desc">${article.description || 'No description available.'}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-link">Read More →</a>
            </div>
        `;
        newsContainer.appendChild(card);
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

searchBtn.addEventListener('click', () => {
    fetchNews(searchInput.value, categorySelect.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchNews(searchInput.value, categorySelect.value);
    }
});

categorySelect.addEventListener('change', () => {
    if (!searchInput.value) {
        fetchNews('', categorySelect.value);
    }
});

// Initial fetch
fetchNews();
