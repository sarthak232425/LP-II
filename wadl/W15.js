/*
W15: Build a product catalog where product details (name, price, image) are stored in a JSON file. The Node.js server should provide the data as an API for a front-end page to display products.
*/

// This script is a standalone Node.js server.
// To run it:
// 1. Save this code as `product_server.js`.
// 2. Create a file named `products.json` in the same directory.
// 3. Put the example JSON content into `products.json`.
// 4. Run `node product_server.js` in your terminal.
// 5. Create and open an HTML file in your browser to see the output.

// --- products.json (Example content) ---
/*
[
  { "id": 101, "name": "Laptop", "price": 80000, "image": "https://via.placeholder.com/150" },
  { "id": 102, "name": "Smartphone", "price": 50000, "image": "https://via.placeholder.com/150" },
  { "id": 103, "name": "Headphones", "price": 5000, "image": "https://via.placeholder.com/150" }
]
*/

// --- index.html (Front-end page) ---
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Product Catalog</title>
    <style>
        #product-catalog { display: flex; gap: 20px; }
        .product { border: 1px solid #ccc; padding: 10px; text-align: center; }
        .product img { max-width: 150px; }
    </style>
</head>
<body>
    <h1>Products</h1>
    <div id="product-catalog"></div>

    <script>
        fetch('http://localhost:3001/api/products')
            .then(response => response.json())
            .then(products => {
                const catalogDiv = document.getElementById('product-catalog');
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Price: ₹${product.price}</p>
                    `;
                    catalogDiv.appendChild(productDiv);
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    </script>
</body>
</html>
*/

// --- product_server.js (Node.js Backend) ---
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/api/products' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'products.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Failed to read products file.' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'API endpoint not found' }));
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Product server running at http://localhost:${PORT}/`);
    console.log('API endpoint: http://localhost:3001/api/products');
});

