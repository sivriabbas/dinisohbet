const express = require('express');
const router = express.Router();
const Surah = require('../models/Surah');
const Post = require('../models/Post');
const Dua = require('../models/Dua');

router.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = 'http://localhost:3002';
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Static pages
        const staticPages = [
            '/', '/quran', '/hadiths', '/duas', '/posts', '/esma', '/guides', 
            '/prayer-times', '/search', '/calendar', '/themes', '/offline'
        ];
        
        staticPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}${page}</loc>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });
        
        // Quran surahs
        for (let i = 1; i <= 114; i++) {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/quran/surah/${i}</loc>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.7</priority>\n`;
            xml += `  </url>\n`;
        }
        
        // Recent posts
        const posts = await Post.find({ isApproved: true }).limit(100);
        posts.forEach(post => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/posts/${post._id}</loc>\n`;
            xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
        });
        
        xml += '</urlset>';
        
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;
