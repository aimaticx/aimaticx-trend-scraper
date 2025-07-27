// Demo data generator for testing the ranking system
// This will be removed once browser dependencies are resolved

const fs = require('fs');
const path = require('path');

// Generate realistic sample data for testing
function generateYouTubeData() {
    return [
        {
            title: "AI Tools That Will Replace Your Job in 2024",
            views: "2.3M views",
            link: "https://youtube.com/shorts/abc123",
            channel: "Tech Insider",
            is_short: true,
            platform: "YouTube",
            scraped_at: new Date().toISOString(),
            monetization_angle: "Create reaction video showing alternative AI tools"
        },
        {
            title: "ChatGPT vs Claude: Ultimate AI Showdown",
            views: "892K views",
            link: "https://youtube.com/shorts/def456",
            channel: "AI Battle",
            is_short: true,
            platform: "YouTube",
            scraped_at: new Date().toISOString(),
            monetization_angle: "Make comparison video with affiliate links"
        },
        {
            title: "Build Apps with AI in 60 Seconds",
            views: "1.5M views",
            link: "https://youtube.com/shorts/ghi789",
            channel: "Quick Code",
            is_short: true,
            platform: "YouTube",
            scraped_at: new Date().toISOString(),
            monetization_angle: "Tutorial series with paid course promotion"
        }
    ];
}

function generateTikTokData(hashtag) {
    return [
        {
            title: "This AI tool makes $10K/month passive income",
            link: "https://www.tiktok.com/@aiexpert/video/1234567890",
            views: "3.2M",
            hashtag: `#${hashtag}`,
            platform: "TikTok",
            scraped_at: new Date().toISOString(),
            monetization_angle: "Create course about AI income strategies"
        },
        {
            title: "Copy this AI prompt to write viral content",
            link: "https://www.tiktok.com/@contentking/video/2345678901",
            views: "1.8M",
            hashtag: `#${hashtag}`,
            platform: "TikTok",
            scraped_at: new Date().toISOString(),
            monetization_angle: "Sell prompt packs and templates"
        },
        {
            title: "AI replaced my entire marketing team",
            link: "https://www.tiktok.com/@startupfounder/video/3456789012",
            views: "956K",
            hashtag: `#${hashtag}`,
            platform: "TikTok",
            scraped_at: new Date().toISOString(),
            monetization_angle: "Marketing automation course sales"
        }
    ];
}

module.exports = {
    generateYouTubeData,
    generateTikTokData
};