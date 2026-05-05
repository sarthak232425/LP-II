/*
W21: Design a backend system to manage books in an online bookstore. Perform the following tasks using Node.js, Express.js, and MongoDB:
*   Add a new book (title, author, price, genre).
*   Retrieve a list of all books.
*   Update book details.
*   Delete a book from the collection.
*/

// This script is a full CRUD API for a bookstore.
// 1. Run `npm init -y`
// 2. Run `npm install express mongodb`
// 3. Make sure your MongoDB server is running.
// 4. Run `node bookstore_api.js`
// 5. Use a tool like Postman or curl to test the API endpoints.

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'bookstore';
const client = new MongoClient(mongoUrl);

let db, booksCollection;

async function connectDB() {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    booksCollection = db.collection('books');
}
connectDB();

// 1. Add a new book
app.post('/books', async (req, res) => {
    // Example body: { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "price": 899, "genre": "Classic" }
    const newBook = req.body;
    const result = await booksCollection.insertOne(newBook);
    res.status(201).send({ message: 'Book added successfully', insertedId: result.insertedId });
});

// 2. Retrieve a list of all books
app.get('/books', async (req, res) => {
    const books = await booksCollection.find({}).toArray();
    res.status(200).send(books);
});

// 3. Update book details
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await booksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    if (result.matchedCount === 0) {
        return res.status(404).send({ message: 'Book not found' });
    }
    res.status(200).send({ message: 'Book updated successfully' });
});

// 4. Delete a book from the collection
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'Book not found' });
    }
    res.status(200).send({ message: 'Book deleted successfully' });
});

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`Bookstore API server running on http://localhost:${PORT}`);
});

