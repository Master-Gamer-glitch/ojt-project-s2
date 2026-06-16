const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/news', async (req, res) => {
    try {
        const { query, category } = req.query;
        let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
        
        if (category && category !== 'all') {
            url += `&category=${category}`;
        }
        
        // If a query is provided, we switch to the 'everything' endpoint which is better for searching
        if (query) {
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                status: 'error', 
                message: data.message || `NewsAPI responded with status: ${response.status}` 
            });
        }
        
        res.json(data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ status: 'error', message: "Failed to fetch news." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
