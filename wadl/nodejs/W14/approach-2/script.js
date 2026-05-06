/*
W14: Create a Node.js server that reads user data from a JSON file and serves it as an API. A front-end page should display the list dynamically using HTML & JavaScript.
*/

// This script is a standalone Node.js server.
// To run it:
// 1. Save this code as `server.js`.
// 2. Create a file named `users.json` in the same directory.
// 3. Put the example JSON content into `users.json`.
// 4. Run `node server.js` in your terminal.
// 5. Open `index.html` in your browser.

// --- users.json (Example content) ---
/*
[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" },
  { "id": 3, "name": "Charlie", "email": "charlie@example.com" }
]
*/

// --- index.html (Front-end page) ---
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <title>User Data</title>
</head>
<body>
    <h1>Users</h1>
    <ul id="user-list"></ul>

    <script>
        fetch('http://localhost:3000/api/users')
            .then(response => response.json())
            .then(users => {
                const userList = document.getElementById('user-list');
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.textContent = `Name: ${user.name}, Email: ${user.email}`;
                    userList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    </script>
</body>
</html>
*/

// --- server.js (Node.js Backend) ---
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Basic CORS headers to allow front-end access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Simple routing
    if (req.url === '/api/users' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'users.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error reading user data file.' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('API endpoint available at http://localhost:3000/api/users');
});


