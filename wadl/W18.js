/*
W18: Perform the following tasks using Node.js, Express.js and MongoDB. The following operation should be performed only on Nodejs and Express.js:
*   a) Create a Database called music.
*   b) Create a collection called song details.
*   c) Insert array of 5 song documents in above Collection. (Fields: Songname, Film, Music_director, singer).
*   d) Display total count of documents and List all the documents in browser.
*   e) List specified Music Director songs.
*   f) List specified Music Director songs sung by specified Singer.
*   g) Delete the song which you don't like.
*   h) Add new song which is your favourite.
*   i) List Songs sung by Specified Singer from specified film.
*   j) Update the document by adding Actor and Actress name.
*   k) Display the above data in Browser in tabular format.
*/

// This script requires Node.js, Express, and the MongoDB driver.
// 1. Run `npm init -y`
// 2. Run `npm install express mongodb`
// 3. Make sure your MongoDB server is running.
// 4. Run `node music_db.js`

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'music';
const client = new MongoClient(mongoUrl);

let db, songCollection;

// Connect to MongoDB and set up collections
async function connectDB() {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
    songCollection = db.collection('songdetails');
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

// --- ROUTES ---

// c) Insert 5 songs (run this once)
app.get('/setup', async (req, res) => {
    await songCollection.deleteMany({}); // Clear collection before setup
    const songs = [
        { Songname: "Tum Hi Ho", Film: "Aashiqui 2", Music_director: "Mithoon", singer: "Arijit Singh" },
        { Songname: "Kal Ho Naa Ho", Film: "Kal Ho Naa Ho", Music_director: "Shankar-Ehsaan-Loy", singer: "Sonu Nigam" },
        { Songname: "Chaiyya Chaiyya", Film: "Dil Se..", Music_director: "A. R. Rahman", singer: "Sukhwinder Singh" },
        { Songname: "Kabira", Film: "Yeh Jawaani Hai Deewani", Music_director: "Pritam", singer: "Arijit Singh" },
        { Songname: "Gerua", Film: "Dilwale", Music_director: "Pritam", singer: "Arijit Singh" },
    ];
    await songCollection.insertMany(songs);
    res.send('Database setup complete. 5 songs inserted.');
});

// d) Display total count and list all documents
app.get('/songs', async (req, res) => {
    const count = await songCollection.countDocuments();
    const songs = await songCollection.find({}).toArray();
    renderTable(res, songs, `All Songs (Total: ${count})`);
});

// e) List specified Music Director songs
app.get('/songs/director/:name', async (req, res) => {
    const songs = await songCollection.find({ Music_director: req.params.name }).toArray();
    renderTable(res, songs, `Songs by ${req.params.name}`);
});

// f) List specified Music Director songs by a specific Singer
app.get('/songs/director/:dir/singer/:sin', async (req, res) => {
    const songs = await songCollection.find({ Music_director: req.params.dir, singer: req.params.sin }).toArray();
    renderTable(res, songs, `Songs by ${req.params.dir} sung by ${req.params.sin}`);
});

// g) Delete a song by name
app.get('/songs/delete/:name', async (req, res) => {
    const result = await songCollection.deleteOne({ Songname: req.params.name });
    res.send(`${result.deletedCount} song(s) named "${req.params.name}" deleted.`);
});

// h) Add a new song
app.post('/songs/add', async (req, res) => {
    // Example body: { "Songname": "New Fav", "Film": "My Life", "Music_director": "Me", "singer": "Me" }
    const newSong = req.body;
    await songCollection.insertOne(newSong);
    res.send('New favorite song added!');
});

// i) List songs by a specific singer from a specific film
app.get('/songs/film/:film/singer/:singer', async (req, res) => {
    const songs = await songCollection.find({ Film: req.params.film, singer: req.params.singer }).toArray();
    renderTable(res, songs, `Songs from ${req.params.film} by ${req.params.singer}`);
});

// j) Update a song to add Actor and Actress
app.get('/songs/update/:name', async (req, res) => {
    // Example: /songs/update/Kabira?actor=Ranbir&actress=Deepika
    const { actor, actress } = req.query;
    await songCollection.updateOne(
        { Songname: req.params.name },
        { $set: { Actor: actor, Actress: actress } }
    );
    res.send(`Song "${req.params.name}" updated with actor and actress.`);
});


const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Music DB server running on http://localhost:${PORT}`);
    console.log('Visit http://localhost:3004/setup to initialize the database.');
});

