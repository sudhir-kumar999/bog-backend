require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'; // Frontend URL
const API_URL = 'http://localhost:5000/api/posts'; // Backend API URL
const SITEMAP_FILE_PATH = path.resolve(__dirname, '../../src/public/sitemap.xml'); // Relative to backend/scripts

async function generateSitemap() {
  try {
    console.log('Fetching blog posts from:', API_URL);
    const response = await axios.get(API_URL);
    const posts = response.data;
    console.log(`Fetched ${posts.length} blog posts.`);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    posts.forEach(post => {
      if (post.slug) {
        sitemap += `
  <url>
    <loc>${BASE_URL}/post/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      } else {
        console.warn(`Post with ID ${post._id || post.id} has no slug. Skipping sitemap entry.`);
      }
    });

    sitemap += `
</urlset>`;

    fs.writeFileSync(SITEMAP_FILE_PATH, sitemap, 'utf8');
    console.log('sitemap.xml generated successfully at:', SITEMAP_FILE_PATH);
  } catch (error) {
    console.error('Error generating sitemap:', error.message);
    if (error.response) {
      console.error('Backend error data:', error.response.data);
      console.error('Backend error status:', error.response.status);
    }
  }
}

generateSitemap(); 