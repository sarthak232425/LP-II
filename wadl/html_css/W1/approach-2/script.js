const products = [
    { name: 'Wireless Headphones', price: 7999, description: 'Noise-cancelling over-ear headphones.', image: 'https://via.placeholder.com/100' },
    { name: 'Smartwatch', price: 12999, description: 'Fitness tracking smartwatch.', image: 'https://via.placeholder.com/100' },
    { name: 'Gaming Mouse', price: 2499, description: 'Ergonomic gaming mouse.', image: 'https://via.placeholder.com/100' },
    { name: 'Laptop Stand', price: 1999, description: 'Adjustable aluminium stand.', image: 'https://via.placeholder.com/100' },
    { name: 'Bluetooth Speaker', price: 4999, description: 'Portable and waterproof.', image: 'https://via.placeholder.com/100' },
    { name: 'USB-C Hub', price: 3499, description: '8-in-1 connectivity hub.', image: 'https://via.placeholder.com/100' },
    { name: 'Mechanical Keyboard', price: 8999, description: 'RGB backlit keyboard.', image: 'https://via.placeholder.com/100' },
    { name: 'Webcam', price: 5999, description: '1080p HD webcam with microphone.', image: 'https://via.placeholder.com/100' },
    { name: 'External SSD', price: 9999, description: '1TB portable solid state drive.', image: 'https://via.placeholder.com/100' },
    { name: 'Monitor', price: 15999, description: '27-inch 4K UHD monitor.', image: 'https://via.placeholder.com/100' },
    { name: 'Tablet', price: 25999, description: '10-inch display, 128GB storage.', image: 'https://via.placeholder.com/100' }
];

let currentPage = 1;
const rowsPerPage = 10;

function displayProducts(page) {
    const productBody = document.getElementById('product-body');
    productBody.innerHTML = '';
    page--; // Adjust for zero-based index

    const start = rowsPerPage * page;
    const end = start + rowsPerPage;
    const paginatedItems = products.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i];
        let row = `<tr>
            <td data-label="Image"><img src="${item.image}" alt="${item.name}"></td>
            <td data-label="Product Name">${item.name}</td>
            <td data-label="Price">₹${item.price.toLocaleString()}</td>
            <td data-label="Description">${item.description}</td>
        </tr>`;
        productBody.innerHTML += row;
    }
}

function setupPagination() {
    if (products.length <= rowsPerPage) return; // No pagination needed

    const paginationControls = document.getElementById('pagination-controls');
    const pageCount = Math.ceil(products.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement('button');
        btn.innerText = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            displayProducts(currentPage);
            updateActiveButton();
        });
        paginationControls.appendChild(btn);
    }
    updateActiveButton();
}

function updateActiveButton() {
    const paginationControls = document.getElementById('pagination-controls');
    const buttons = paginationControls.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        if (parseInt(buttons[i].innerText) === currentPage) {
            buttons[i].classList.add('active');
        }
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(currentPage);
    setupPagination();
});
