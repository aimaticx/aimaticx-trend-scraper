const express = require('express');
const path = require('path');
const fs = require('fs');
const tiktokScraper = require('./scrapers/tiktok-scraper');
const youtubeScraper = require('./scrapers/youtube-scraper');
const { generateYouTubeData, generateTikTokData } = require('./demo-data');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Ensure data directory exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to run TikTok scraper
app.post('/api/scrape/tiktok', async (req, res) => {
    try {
        console.log('Starting TikTok scraping...');
        const { hashtag = 'aitools' } = req.body;
        
        const results = await tiktokScraper.scrapeHashtag(hashtag);
        
        // Save to file
        const filename = `tiktok_${hashtag}_trending_${Date.now()}.json`;
        const filepath = path.join(__dirname, 'data', filename);
        fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
        
        res.json({
            success: true,
            message: `Successfully scraped ${results.length} TikTok videos for #${hashtag}`,
            data: results,
            filename: filename
        });
    } catch (error) {
        console.error('TikTok scraping error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to scrape TikTok data',
            error: error.message
        });
    }
});

// API endpoint to run YouTube scraper
app.post('/api/scrape/youtube', async (req, res) => {
    try {
        console.log('Starting YouTube Shorts scraping...');
        
        const results = await youtubeScraper.scrapeTrendingShorts();
        
        // Save to file
        const filename = `youtube_shorts_trending_${Date.now()}.json`;
        const filepath = path.join(__dirname, 'data', filename);
        fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
        
        res.json({
            success: true,
            message: `Successfully scraped ${results.length} YouTube Shorts trends`,
            data: results,
            filename: filename
        });
    } catch (error) {
        console.error('YouTube scraping error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to scrape YouTube data',
            error: error.message
        });
    }
});

// API endpoint to get saved data files
app.get('/api/data/files', (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');
        const files = fs.readdirSync(dataDir)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filepath = path.join(dataDir, file);
                const stats = fs.statSync(filepath);
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    platform: file.includes('tiktok') ? 'TikTok' : 'YouTube'
                };
            })
            .sort((a, b) => new Date(b.created) - new Date(a.created));
        
        res.json({ success: true, files });
    } catch (error) {
        console.error('Error reading data files:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to read data files',
            error: error.message
        });
    }
});

// API endpoint to get specific data file
app.get('/api/data/:filename', (req, res) => {
    try {
        const filepath = path.join(__dirname, 'data', req.params.filename);
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
        
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error reading data file:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to read data file',
            error: error.message
        });
    }
});

// API endpoint to scrape both platforms and merge results
app.post('/api/scrape/combined', async (req, res) => {
    try {
        console.log('Starting combined scraping (YouTube + TikTok)...');
        const { hashtag = 'aitools' } = req.body;
        
        const results = {
            youtube: [],
            tiktok: [],
            combined: [],
            errors: []
        };

        // Scrape TikTok first (more reliable)
        try {
            results.tiktok = await tiktokScraper.scrapeHashtag(hashtag);
            console.log(`TikTok: ${results.tiktok.length} videos scraped`);
        } catch (error) {
            console.error('TikTok scraping failed, using fallback data for development:', error.message);
            results.tiktok = generateTikTokData(hashtag);
            results.errors.push(`TikTok scraping failed - browser dependencies need resolution`);
        }

        // Scrape YouTube 
        try {
            results.youtube = await youtubeScraper.scrapeTrendingShorts();
            console.log(`YouTube: ${results.youtube.length} videos scraped`);
        } catch (error) {
            console.error('YouTube scraping failed, using fallback data for development:', error.message);
            results.youtube = generateYouTubeData();
            results.errors.push(`YouTube scraping failed - browser dependencies need resolution`);
        }

        // Merge and rank results
        const combined = [...results.tiktok, ...results.youtube];
        
        // Simple ranking algorithm based on engagement metrics
        results.combined = combined
            .map((item, index) => ({
                ...item,
                rank_score: calculateRankScore(item),
                original_index: index
            }))
            .sort((a, b) => b.rank_score - a.rank_score)
            .map((item, index) => ({
                ...item,
                final_rank: index + 1
            }));

        // Save merged results
        const filename = `combined_trends_${hashtag}_${Date.now()}.json`;
        const filepath = path.join(__dirname, 'data', filename);
        fs.writeFileSync(filepath, JSON.stringify(results, null, 2));

        res.json({
            success: true,
            message: `Combined scraping complete: ${results.tiktok.length} TikTok + ${results.youtube.length} YouTube videos`,
            data: results,
            filename: filename,
            summary: {
                total_videos: results.combined.length,
                tiktok_count: results.tiktok.length,
                youtube_count: results.youtube.length,
                errors: results.errors
            }
        });

    } catch (error) {
        console.error('Combined scraping error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to perform combined scraping',
            error: error.message
        });
    }
});

// Ranking algorithm helper function
function calculateRankScore(item) {
    let score = 0;
    
    // Parse view counts and assign scores
    const views = item.views?.toLowerCase() || '';
    
    if (views.includes('k')) {
        const num = parseFloat(views);
        score += num * 1000;
    } else if (views.includes('m')) {
        const num = parseFloat(views);
        score += num * 1000000;
    } else if (views.includes('b')) {
        const num = parseFloat(views);
        score += num * 1000000000;
    }
    
    // Platform bonus (TikTok trends faster)
    if (item.platform === 'TikTok') {
        score *= 1.2;
    }
    
    // Recency bonus (newer content ranks higher)
    if (item.scraped_at) {
        const hoursSinceScraped = (Date.now() - new Date(item.scraped_at)) / (1000 * 60 * 60);
        score *= Math.max(0.5, 1 - (hoursSinceScraped / 24)); // Decay over 24 hours
    }
    
    // Short content bonus for YouTube
    if (item.platform === 'YouTube' && item.is_short) {
        score *= 1.3;
    }
    
    return Math.round(score);
}

// Top 5 trends endpoint for automation pipeline
app.get('/top_5.json', async (req, res) => {
    try {
        const hashtag = req.query.hashtag || 'trending';
        const timestamp = Date.now();
        
        // Get latest combined data
        const results = {
            youtube: [],
            tiktok: [],
            combined: [],
            errors: []
        };

        // Scrape TikTok
        try {
            results.tiktok = await tiktokScraper.scrapeHashtag(hashtag);
        } catch (error) {
            console.error('TikTok scraping failed, using fallback data:', error.message);
            results.tiktok = generateTikTokData(hashtag);
            results.errors.push(`TikTok scraping failed - browser dependencies need resolution`);
        }

        // Scrape YouTube 
        try {
            results.youtube = await youtubeScraper.scrapeTrendingShorts();
        } catch (error) {
            console.error('YouTube scraping failed, using fallback data:', error.message);
            results.youtube = generateYouTubeData();
            results.errors.push(`YouTube scraping failed - browser dependencies need resolution`);
        }

        // Combine and rank all videos
        const allVideos = [...results.tiktok, ...results.youtube];
        results.combined = allVideos
            .map((item, index) => ({
                ...item,
                rank_score: calculateRankScore(item),
                original_index: index
            }))
            .sort((a, b) => b.rank_score - a.rank_score)
            .map((item, index) => ({
                ...item,
                final_rank: index + 1
            }));

        // Return top 5 only
        const top5 = results.combined.slice(0, 5);
        
        const response = {
            timestamp: new Date().toISOString(),
            hashtag: hashtag,
            total_videos: results.combined.length,
            top_5: top5,
            sources: {
                tiktok_count: results.tiktok.length,
                youtube_count: results.youtube.length
            },
            errors: results.errors
        };

        res.json(response);
    } catch (error) {
        console.error('Top 5 endpoint error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch top 5 trends',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Web scraper server running on http://0.0.0.0:${PORT}`);
    console.log('📊 Ready to scrape YouTube Shorts and TikTok trends!');
});
