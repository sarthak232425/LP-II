/*
W19: Perform the following tasks using Node.js, Express.js and MongoDB. The following operation should be performed only on Node.js and Express.js:
*   a) Create a Database called student.
*   b) Create a collection called studentmarks.
*   c) Insert array of documents in above Collection. (Fields: Name, Roll_No, WAD_Marks, CC_Marks, DSBDA_Marks, CNS_Marks, AI_marks).
*   d) Display total count of documents and List all the documents in browser.
*   e) List the names of students who got more than 20 marks in DSBDA Subject in browser.
*   f) Update the marks of Specified students by 10.
*   g) List the names who got more than 25 marks in all subjects in browser.
*   h) List the names who got less than 40 in both Maths and Science in browser. (Assuming WAD and CC are Maths/Science)
*   i) Remove specified student document from collection.
*   j) Display the Students data in Browser in tabular format.
*/

// This script requires Node.js, Express, and the MongoDB driver.
// 1. Run `npm init -y`
// 2. Run `npm install express mongodb`
// 3. Make sure your MongoDB server is running.
// 4. Run `node student_db.js`

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'student';
const client = new MongoClient(mongoUrl);

let db, marksCollection;

async function connectDB() {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    marksCollection = db.collection('studentmarks');
}
connectDB();

// Helper to render data in a simple HTML table
function renderTable(res, data, title) {
    let table = `<style>table,th,td{border:1px solid #ccc; border-collapse:collapse; padding:5px;}</style><h1>${title}</h1><table border="1">`;
    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        table += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
        data.forEach(item => {
            table += '<tr>' + headers.map(h => `<td>${item[h] || ''}</td>`).join('') + '</tr>';
        });
    } else {
        table += '<tr><td>No data found</td></tr>';
    }
    table += '</table>';
    res.send(table);
}

// c) Insert documents
app.get('/setup', async (req, res) => {
    await marksCollection.deleteMany({});
    const students = [
        { Name: "Rahul", Roll_No: 1, WAD_Marks: 85, CC_Marks: 90, DSBDA_Marks: 78, CNS_Marks: 88, AI_marks: 92 },
        { Name: "Priya", Roll_No: 2, WAD_Marks: 35, CC_Marks: 38, DSBDA_Marks: 25, CNS_Marks: 45, AI_marks: 50 },
        { Name: "Amit", Roll_No: 3, WAD_Marks: 95, CC_Marks: 98, DSBDA_Marks: 92, CNS_Marks: 96, AI_marks: 99 },
        { Name: "Sneha", Roll_No: 4, WAD_Marks: 15, CC_Marks: 18, DSBDA_Marks: 12, CNS_Marks: 20, AI_marks: 22 },
    ];
    await marksCollection.insertMany(students);
    res.send('Student marks database setup complete.');
});

// d) Display count and list all documents
app.get('/students', async (req, res) => {
    const count = await marksCollection.countDocuments();
    const students = await marksCollection.find({}).toArray();
    renderTable(res, students, `All Students (Total: ${count})`);
});

// e) List students with > 20 marks in DSBDA
app.get('/students/dsbda-high', async (req, res) => {
    const students = await marksCollection.find({ DSBDA_Marks: { $gt: 20 } }, { projection: { Name: 1, _id: 0 } }).toArray();
    renderTable(res, students, 'Students with > 20 marks in DSBDA');
});

// f) Update marks of a specified student by 10
app.get('/students/update/:name', async (req, res) => {
    const result = await marksCollection.updateOne(
        { Name: req.params.name },
        { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10 } }
    );
    res.send(`${result.modifiedCount} student(s) named "${req.params.name}" updated.`);
});

// g) List students with > 25 marks in all subjects
app.get('/students/all-subjects-high', async (req, res) => {
    const students = await marksCollection.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_marks: { $gt: 25 }
    }, { projection: { Name: 1, _id: 0 } }).toArray();
    renderTable(res, students, 'Students with > 25 in all subjects');
});

// h) List students with < 40 in WAD and CC
app.get('/students/low-wad-cc', async (req, res) => {
    const students = await marksCollection.find({
        WAD_Marks: { $lt: 40 },
        CC_Marks: { $lt: 40 }
    }, { projection: { Name: 1, _id: 0 } }).toArray();
    renderTable(res, students, 'Students with < 40 in WAD & CC');
});

// i) Remove a specified student
app.get('/students/delete/:name', async (req, res) => {
    const result = await marksCollection.deleteOne({ Name: req.params.name });
    res.send(`${result.deletedCount} student(s) named "${req.params.name}" removed.`);
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Student DB server running on http://localhost:${PORT}`);
    console.log('Visit http://localhost:3005/setup to initialize.');
});


