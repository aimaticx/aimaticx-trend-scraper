# YouTube & TikTok Trend Scraper

A Node.js web scraping application that monitors YouTube Shorts and TikTok trends using Puppeteer to identify viral content opportunities for creators and marketers.

## Features

- **Multi-Platform Scraping**: Scrapes trending content from both YouTube Shorts and TikTok
- **Combined Ranking System**: Merges both platforms into one ranked trend file
- **Automation-Ready**: JSON output with timestamps for automation pipelines
- **Web Interface**: Bootstrap-based UI for easy interaction
- **Anti-Detection**: Uses Puppeteer with stealth plugin to avoid bot detection

## Project Structure

```
├── server.js                    # Main Express server with all API endpoints
├── package.json                 # Dependencies and scripts
├── demo-data.js                 # Fallback data for development
├── scrapers/
│   ├── tiktok-scraper.js       # TikTok hashtag scraping class
│   └── youtube-scraper.js      # YouTube Shorts scraping class
├── public/
│   ├── index.html              # Web interface
│   ├── script.js               # Frontend JavaScript
│   └── style.css               # Custom styling
├── data/                       # JSON output storage (auto-created)
├── tiktok_hashtag_scraper.js   # Standalone TikTok scraper
├── youtube_shorts_scraper.js   # Standalone YouTube scraper
└── sample_top_5_trends_*.json  # Example output format

```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Access Web Interface**
   ```
   http://localhost:5000
   ```

## API Endpoints

### Core Endpoints

- **GET `/top_5.json`** - Returns top 5 trending videos (automation endpoint)
  - Query params: `?hashtag=aitools` (optional)
  - Returns: JSON with ranked top 5 videos and metadata

- **POST `/api/scrape/youtube`** - Scrape YouTube Shorts trending
- **POST `/api/scrape/tiktok`** - Scrape TikTok hashtag content
  - Body: `{"hashtag": "aitools"}`
- **POST `/api/scrape/combined`** - Combined scraping and ranking
  - Body: `{"hashtag": "aitools"}`

### Utility Endpoints

- **GET `/api/health`** - Server health check

## Output Format

All JSON files include timestamps and are saved to the `/data` directory:

```json
{
  "timestamp": "2025-07-27T15:00:00.000Z",
  "hashtag": "aitools", 
  "total_videos": 6,
  "top_5": [
    {
      "title": "AI Tools That Will Replace Your Job in 2024",
      "views": "2.3M views",
      "link": "https://youtube.com/shorts/abc123",
      "platform": "YouTube",
      "rank_score": 2990000,
      "final_rank": 1,
      "monetization_angle": "Create reaction video showing alternative AI tools"
    }
  ],
  "sources": {
    "tiktok_count": 3,
    "youtube_count": 3
  }
}
```

## Dependencies

- **express**: Web server framework
- **puppeteer**: Browser automation
- **puppeteer-extra**: Enhanced Puppeteer with plugins
- **puppeteer-extra-plugin-stealth**: Anti-detection measures

## Usage Examples

### Automation Pipeline
```bash
# Get top 5 trending AI tools content
curl "http://localhost:5000/top_5.json?hashtag=aitools"
```

### Web Interface
1. Open `http://localhost:5000`
2. Select platform (YouTube, TikTok, or Combined)
3. Enter hashtag (optional for TikTok)
4. Click "Start Scraping"
5. View results with monetization suggestions

### Individual Platform Scraping
```bash
# TikTok hashtag scraping
curl -X POST http://localhost:5000/api/scrape/tiktok \
  -H "Content-Type: application/json" \
  -d '{"hashtag":"aitools"}'

# YouTube trending scraping  
curl -X POST http://localhost:5000/api/scrape/youtube
```

## Development Notes

- Browser dependencies required for Puppeteer (automatically handled)
- Fallback demo data available when browser unavailable
- All scraped data includes timestamps for automation workflows
- Combined ranking algorithm considers views, platform, recency, and content type

## Ranking Algorithm

Videos are scored and ranked based on:
- **View Count**: Higher views = higher score
- **Platform Bonus**: TikTok gets 20% bonus (trends faster)
- **Content Type**: YouTube Shorts get 30% bonus
- **Recency**: Newer content ranked higher with 24-hour decay

## License

MIT License - Free for personal and commercial use.