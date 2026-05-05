/*
W11: Write a JavaScript Program to create a login (username, password) and registration form (name, email, mobile number, dob, city, address) and push to an array/local storage with the AJAX POST method and a data list in a new page. Add proper validations for each form element.
*/

// This script requires two HTML files: one for registration/login and one to display the data.
// The HTML is commented out below for context. The logic assumes you are on the registration page.

/*
HTML for Registration Page (e.g., register.html):
<body>
    <h2>Registration Form</h2>
    <form id="regForm">
        <input type="text" id="name" placeholder="Name" required><br>
        <input type="email" id="email" placeholder="Email" required><br>
        <input type="tel" id="mobile" placeholder="Mobile Number" required pattern="[0-9]{10}"><br>
        <input type="date" id="dob" required><br>
        <input type="text" id="city" placeholder="City" required><br>
        <textarea id="address" placeholder="Address" required></textarea><br>
        <input type="password" id="password" placeholder="Password" required minlength="6"><br>
        <button type="submit">Register</button>
    </form>
    <p id="regMessage"></p>
</body>
*/

/*
HTML for Data List Page (e.g., data.html):
<body>
    <h1>Registered Users</h1>
    <pre id="userData"></pre>
    <script>
        // Script on this page would retrieve and display the data
        window.onload = () => {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            document.getElementById('userData').textContent = JSON.stringify(users, null, 2);
        };
    </script>
</body>
*/

// --- JavaScript for Registration Page ---

document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission

            // Basic validation check
            if (!this.checkValidity()) {
                event.stopPropagation();
                document.getElementById('regMessage').textContent = 'Please fill out all fields correctly.';
                return;
            }

            const newUser = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                mobile: document.getElementById('mobile').value,
                dob: document.getElementById('dob').value,
                city: document.getElementById('city').value,
                address: document.getElementById('address').value,
                password: document.getElementById('password').value,
            };

            // Simulate AJAX POST to local storage
            mockAjaxPost(newUser, (success, message) => {
                const regMessage = document.getElementById('regMessage');
                regMessage.textContent = message;
                if (success) {
                    this.reset();
                    // You could redirect here: window.location.href = 'data.html';
                }
            });
        });
    }
});

/**
 * Simulates an AJAX POST request. In a real scenario, this would use fetch() or XMLHttpRequest.
 * @param {object} data The user data to "post".
 * @param {function} callback The function to call after the operation.
 */
function mockAjaxPost(data, callback) {
    // Simulate network delay
    setTimeout(() => {
        try {
            // Retrieve existing users from local storage or initialize an empty array
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user already exists
            const userExists = users.some(user => user.email === data.email);
            if (userExists) {
                callback(false, 'Error: A user with this email already exists.');
                return;
            }

            // Add new user and save back to local storage
            users.push(data);
            localStorage.setItem('users', JSON.stringify(users));
            callback(true, 'Registration successful! Data saved.');
        } catch (error) {
            console.error('Failed to save to local storage:', error);
            callback(false, 'Error: Could not save data.');
        }
    }, 500); // 500ms delay
}

