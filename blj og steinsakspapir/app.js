require('dotenv').config(); // Load environment variables
const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlm = require('./sqlm.js');
const bcrypt = require("bcrypt")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const staticPath = path.join(__dirname, 'public');
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SECRET_KEY,  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to `true` if using HTTPS
}));

// Simulated users (use a database in real projects)
const users = [{ username: "player1", password: "password123" }];

// Login Route

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await findUser(username, password);

  if (user) {
    req.session.user = user;
    res.redirect("/app.html"); // Redirect on successful login
  } else {
    res.status(401).send("Invalid credentials");
  }
});

async function findUser(username, password) {
  // Replace this with actual database query
  // For demonstration purposes, we're returning a hardcoded user
  let user = await sqlm.getUserByUsername(username); // Ensure this returns a promise
  console.log(user);
  // Sjekk om passordet samsvarer med hash'en i databasen
  if (!(user && await bcrypt.compare(password, user.password))){
    user = null
  }
  return user;
}

// Logout Route
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  console.log(req.session.user)  
  if (!req.session.user) {
    return res.redirect("/login.html"); // Redirect to login page
  }
  next();
}

app.get('/getgames', requireLogin, async (req, res) => {
    console.log('/getgames/')

    const games = sqlm.getGames()
    
    res.send(games)
  });

// Protected Game Route (ensures only logged-in users can access games)
app.get("/playgame/", requireLogin, (req, res) => {
  const game = req.query.game
  const gamePath = path.join(__dirname, "public", game, "index.html");
  res.sendFile(gamePath);
});

app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'));
});

// Start Server
app.listen(3000, () => console.log('Server is running on http://localhost:3000/'));
