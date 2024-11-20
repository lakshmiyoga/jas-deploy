const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');
const routes = require('./src/routes'); // Adjust the path if needed

// Create a writable stream
const sitemapStream = new SitemapStream({ hostname: 'https://www.jasfruitsandvegetables.in' });

// Create a sitemap and add routes
routes.forEach(route => {
    sitemapStream.write({ url: route.path, changefreq: route.changefreq, priority: route.priority });
});
sitemapStream.end();

// Write to sitemap.xml
streamToPromise(sitemapStream).then(data => {
    fs.writeFileSync(path.resolve(__dirname, './public/sitemap.xml'), data);
    console.log('Sitemap generated and saved in public/sitemap.xml');
}).catch(err => {
    console.error('Error generating sitemap:', err);
});