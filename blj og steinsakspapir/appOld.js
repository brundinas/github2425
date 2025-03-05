
require('dotenv').config(); // Load environment variables
const saltRounds = 10;
const path = require('path');
const express = require('express');
const session = require('express-session');
const sqlm = require('./sqlm.js');

//const db = sqlm.db;

const app = express();
const bcrypt = require('bcrypt');



const staticPath = path.join(__dirname, 'public');
app.use(express.urlencoded({ extended: true })); // To parse urlencoded parameters
app.use(express.json()); // To parse JSON bodies



app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'));
});

app.get('/admin/',  (req, res) => {
    console.log('admin');
    res.sendFile(path.join(staticPath, 'admin', 'index.html')); // Ensure the correct path to the admin HTML file
});

app.get('/blackjack/',  (req, res) => {
    console.log('blackjack');
    res.redirect('/blackjack/index.html');
    //res.sendFile(path.join(staticPath, 'admin', 'index.html')); // Ensure the correct path to the admin HTML file
});

app.get('/getgames', async (req, res) => {
    console.log('/getgames/')

    const games = sqlm.getGames()
    
    res.send(games)
});





app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/');
})