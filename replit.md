# Social Media Trend Scraper

## Overview

This is a Node.js web application that scrapes trending content from TikTok and YouTube Shorts to identify viral content opportunities for creators and marketers. The application provides a web interface for initiating scraping operations and displays results with monetization insights.

## User Preferences

Preferred communication style: Simple, everyday language.
Project Priority: YouTube scraper critical for Shorts automation pipeline.
Feature Request: JSON merged into one ranked trend file (COMPLETED).

## System Architecture

### Backend Architecture
- **Framework**: Express.js server running on Node.js
- **Web Scraping**: Puppeteer with stealth plugin for browser automation
- **File System**: JSON-based data storage in local `/data` directory
- **API Design**: RESTful endpoints for scraping operations

### Frontend Architecture
- **Technology**: Vanilla JavaScript with Bootstrap 5 for styling
- **Interface**: Single-page application with real-time status updates
- **Styling**: Custom CSS with Font Awesome icons for enhanced UX

### Data Storage
- **Format**: JSON files stored locally in `/data` directory
- **Naming Convention**: Platform-specific timestamped files (e.g., `tiktok_aitools_trending_1234567890.json`)
- **Structure**: Arrays of objects containing title, link, views, and monetization suggestions

## Key Components

### Server Components
1. **Main Server** (`server.js`): Express application with middleware setup and route definitions
2. **TikTok Scraper** (`scrapers/tiktok-scraper.js`): Class-based scraper for hashtag-specific content
3. **YouTube Scraper** (`scrapers/youtube-scraper.js`): Class-based scraper for trending Shorts content
4. **Combined Ranking API** (`/api/scrape/combined`): Merges both platforms and ranks content by engagement

### Frontend Components
1. **HTML Interface** (`public/index.html`): Bootstrap-based responsive UI
2. **JavaScript Controller** (`public/script.js`): Event handling and API communication
3. **Styling** (`public/style.css`): Custom styles for enhanced visual presentation

### Scraping Strategy
- **Anti-Detection**: Puppeteer-extra with stealth plugin to avoid bot detection
- **Browser Configuration**: Headless Chrome with optimized arguments for performance
- **Data Extraction**: DOM manipulation to extract titles, links, view counts, and metadata

## Data Flow

1. **User Interaction**: User selects platform and optionally specifies hashtag
2. **API Request**: Frontend sends POST request to appropriate scraping endpoint
3. **Browser Launch**: Puppeteer launches headless Chrome instance
4. **Page Navigation**: Browser navigates to target platform URL
5. **Content Extraction**: DOM scraping extracts relevant video data
6. **Data Processing**: Results are formatted with monetization suggestions
7. **File Storage**: JSON data saved to local filesystem with timestamp
8. **Response**: API returns success status with scraped data and filename

## External Dependencies

### Core Dependencies
- **Express**: ^5.1.0 - Web server framework
- **Puppeteer-extra**: ^3.3.6 - Enhanced Puppeteer with plugin support
- **Puppeteer-extra-plugin-stealth**: ^2.11.2 - Anti-detection measures

### Frontend Dependencies (CDN)
- **Bootstrap**: 5.3.0 - UI framework for responsive design
- **Font Awesome**: 6.4.0 - Icon library for enhanced UX

### Platform Integrations
- **TikTok**: Direct web scraping of hashtag pages
- **YouTube**: Direct web scraping of trending feed

## Deployment Strategy

### Local Development
- **Entry Point**: `server.js` started via `npm start`
- **Port Configuration**: Environment variable `PORT` or default 5000
- **Data Persistence**: Local filesystem storage in `/data` directory

### Production Considerations
- **Browser Requirements**: Chrome/Chromium must be available in deployment environment
- **Memory Management**: Browser instances are properly closed after scraping
- **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
- **File Management**: Automatic creation of data directory if not exists

### Scalability Notes
- Current implementation uses single browser instance per scraping operation
- Browser instances are reused within scraper classes for efficiency
- File-based storage suitable for small to medium scale operations
- Consider database integration for larger scale deployments

### Security Considerations
- Stealth plugin reduces detection risk from target platforms
- No authentication implemented - suitable for internal/private use
- Rate limiting not implemented - consider adding for production use