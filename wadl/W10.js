/*
W10: Develop a to-do list that automatically saves tasks (add, update, delete) to the server using AJAX without requiring a page refresh.
*/

// This file would be part of an HTML file.
// The HTML structure is commented out below for context.

/*
HTML Structure:
<body>
    <h1>To-Do List</h1>
    <input type="text" id="taskInput" placeholder="Add a new task">
    <button onclick="addTask()">Add Task</button>
    <ul id="taskList"></ul>
</body>
*/

// --- Client-Side JavaScript ---

// In-memory array to hold tasks on the client
let tasks = [];

// Function to render tasks to the UI
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = { id: Date.now(), text: text };

    // AJAX POST request to add task
    mockApiCall('POST', '/tasks', newTask, (response) => {
        tasks.push(response);
        renderTasks();
        taskInput.value = '';
    });
}

// Function to delete a task
function deleteTask(id) {
    // AJAX DELETE request
    mockApiCall('DELETE', `/tasks/${id}`, null, () => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    });
}

// --- Server-Side Simulation ---

// This simulates a server-side database.
let serverTasks = [];
let nextId = 1;

// This function simulates making an AJAX call to a server.
function mockApiCall(method, url, data, callback) {
    console.log(`AJAX Request: ${method} ${url}`);
    let response;

    // Simulate network delay
    setTimeout(() => {
        // --- Start of "Server" Logic ---
        if (method === 'POST' && url === '/tasks') {
            // Create new task on the "server"
            const newTask = { id: nextId++, text: data.text };
            serverTasks.push(newTask);
            response = newTask; // Server responds with the created task
            console.log('Server state:', serverTasks);
        }
        else if (method === 'DELETE' && url.startsWith('/tasks/')) {
            // Delete task on the "server"
            const id = parseInt(url.split('/')[2]);
            serverTasks = serverTasks.filter(task => task.id !== id);
            response = { message: 'Task deleted' }; // Server confirms deletion
            console.log('Server state:', serverTasks);
        }
        // --- End of "Server" Logic ---

        // Execute the callback with the server's response
        if (callback) {
            callback(response);
        }
    }, 500); // 500ms delay
}

// Initial load of tasks (simulating a GET request on page load)
// In a real app, you'd do this on window.onload
function initialLoad() {
    // Let's pre-populate the server with some data
    serverTasks = [
        { id: nextId++, text: 'Learn AJAX' },
        { id: nextId++, text: 'Build a to-do list' }
    ];
    // Client fetches the data
    tasks = [...serverTasks];
    renderTasks();
}

// Call initialLoad when the script runs
initialLoad();

