/*
W16: Create a Node.JS Application that serves as a static website for Restaurants/Art Gallery.
*/

// This script is a standalone Node.js static file server.
// To run it:
// 1. Save this code as `static_server.js`.
// 2. Create a folder named `public` in the same directory.
// 3. Inside `public`, create `index.html`, `about.html`, and `style.css`.
// 4. Add some basic content to those files.
// 5. Run `node static_server.js` in your terminal.
// 6. Visit http://localhost:3002 to see your site.

// --- public/index.html (Example content) ---
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Art Gallery</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to the Art Gallery</h1>
    <p>Explore our collection.</p>
    <a href="about.html">About Us</a>
</body>
</html>
*/

// --- public/about.html (Example content) ---
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <title>About Us</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>About the Gallery</h1>
    <p>We are passionate about art.</p>
    <a href="index.html">Back to Home</a>
</body>
</html>
*/

// --- public/style.css (Example content) ---
/*
body { font-family: sans-serif; background-color: #f0f0f0; text-align: center; }
h1 { color: #333; }
*/


// --- static_server.js (Node.js Backend) ---
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Determine the file path from the request URL
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // Get the file extension to set the correct Content-Type
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // Page not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Static server running at http://localhost:${PORT}/`);
});

