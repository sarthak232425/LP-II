/*
W17: Build an Employee Directory where employee details (name, designation, department, salary, and profile image) are stored in a JSON file. A Node.js server should provide this data as an API, and a front-end page should fetch and display employee details.
*/

// This script is a standalone Node.js server for an employee directory API.
// To run it:
// 1. Save this code as `employee_server.js`.
// 2. Create a file named `employees.json` in the same directory.
// 3. Put the example JSON content into `employees.json`.
// 4. Run `node employee_server.js` in your terminal.
// 5. Create and open an HTML file in your browser to see the output.

// --- employees.json (Example content) ---
/*
[
  {
    "id": 1,
    "name": "Sonia Gupta",
    "designation": "Software Engineer",
    "department": "Technology",
    "salary": 90000,
    "profile_image": "https://via.placeholder.com/100"
  },
  {
    "id": 2,
    "name": "Raj Patel",
    "designation": "Project Manager",
    "department": "Management",
    "salary": 120000,
    "profile_image": "https://via.placeholder.com/100"
  }
]
*/

// --- index.html (Front-end page) ---
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Employee Directory</title>
    <style>
        .employee-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .employee-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .employee-card img { max-width: 80px; border-radius: 50%; }
    </style>
</head>
<body>
    <h1>Employee Directory</h1>
    <div id="employee-grid"></div>

    <script>
        fetch('http://localhost:3003/api/employees')
            .then(response => response.json())
            .then(employees => {
                const grid = document.getElementById('employee-grid');
                employees.forEach(emp => {
                    const card = document.createElement('div');
                    card.className = 'employee-card';
                    card.innerHTML = `
                        <img src="${emp.profile_image}" alt="${emp.name}">
                        <h3>${emp.name}</h3>
                        <p><strong>Designation:</strong> ${emp.designation}</p>
                        <p><strong>Department:</strong> ${emp.department}</p>
                        <p><strong>Salary:</strong> ₹${emp.salary.toLocaleString()}</p>
                    `;
                    grid.appendChild(card);
                });
            })
            .catch(error => console.error('Error fetching employees:', error));
    </script>
</body>
</html>
*/

// --- employee_server.js (Node.js Backend) ---
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/api/employees' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'employees.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Could not read employees file.' }));
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

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`Employee server running at http://localhost:${PORT}/`);
    console.log('API endpoint: http://localhost:3003/api/employees');
});


