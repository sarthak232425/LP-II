/*
W20: Create a backend application for managing employee records. Perform the following tasks using Node.js, Express.js, and MongoDB:
*   Add a new employee (name, department, designation, salary, joining date).
*   View all employee records.
*   Update an existing employee's details.
*   Delete an employee record.
*/

// This script is a full CRUD API for employee records.
// 1. Run `npm init -y`
// 2. Run `npm install express mongodb`
// 3. Make sure your MongoDB server is running.
// 4. Run `node employee_crud.js`
// 5. Use a tool like Postman or curl to test the API endpoints.

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'company';
const client = new MongoClient(mongoUrl);

let db, employeesCollection;

async function connectDB() {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    employeesCollection = db.collection('employees');
}
connectDB();

// 1. Add a new employee
app.post('/employees', async (req, res) => {
    // Example body: { "name": "John Doe", "department": "HR", "designation": "Recruiter", "salary": 60000, "joining_date": "2023-01-15" }
    const newEmployee = req.body;
    const result = await employeesCollection.insertOne(newEmployee);
    res.status(201).send({ message: 'Employee added successfully', insertedId: result.insertedId });
});

// 2. View all employee records
app.get('/employees', async (req, res) => {
    const employees = await employeesCollection.find({}).toArray();
    res.status(200).send(employees);
});

// 3. Update an existing employee's details
app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await employeesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    if (result.matchedCount === 0) {
        return res.status(404).send({ message: 'Employee not found' });
    }
    res.status(200).send({ message: 'Employee updated successfully' });
});

// 4. Delete an employee record
app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const result = await employeesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'Employee not found' });
    }
    res.status(200).send({ message: 'Employee deleted successfully' });
});

const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Employee CRUD server running on http://localhost:${PORT}`);
});

