export default async function handler(req, res) {
    const { query, category } = req.query;
    
    // Determine the correct NewsAPI endpoint
    let apiUrl = 'https://newsapi.org/v2/top-headlines?country=us';
    
    if (query && query.trim() !== '') {
        apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}`;
    } else if (category && category !== 'all') {
        apiUrl += `&category=${encodeURIComponent(category)}`;
    }
    
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ 
            status: 'error', 
            message: 'Server configuration error: Missing NEWS_API_KEY environment variable.' 
        });
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Api-Key': apiKey
            }
        });
        
        const data = await response.json();
        
        // Return the data exactly as NewsAPI sends it so the frontend can parse it
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}
