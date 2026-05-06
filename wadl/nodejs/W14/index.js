/*
W14: Create a Node.js server that reads user data from a JSON file and serves it as an API. A front-end page should display the list dynamically using HTML & JavaScript.
*/
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, client-side JS) from the current directory
app.use(express.static(__dirname));

// API endpoint to get all students
app.get('/students', (req, res) => {
    const filePath = path.join(__dirname, 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).json({ message: 'Error reading user data file.' });
        }
        res.json(JSON.parse(data));
    });
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server for W14 is listening at http://localhost:${port}`);
});



