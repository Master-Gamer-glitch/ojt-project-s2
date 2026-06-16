export const LANGUAGE_COLORS = {
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

export function getLanguageColor(lang) {
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

export function formatKB(kb) {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
