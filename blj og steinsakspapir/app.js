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
app.use(express.static(staticPath))

//app.use(express.static(path.join(__dirname, "public")));

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
  console.log(req.body)
  const user = await findUser(username, password);

  if (user) {
    user.password = ""
    req.session.user = user;
    res.redirect("/app.html"); // Redirect on successful login
  } else {
    res.status(401).send({ error: 'Ugyldig passord eller brukernavn'});
  }
});

app.post("/registeruser", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  const result = await registerUser(username, password);

  if (!result.error) {
    req.session.user = result;
    res.redirect("/app.html"); // Redirect on successful login
  } else {
    res.status(401).send(result);
  }
});

async function findUser(username, password) {

  let user = await sqlm.getUserByUsername(username); // Ensure this returns a promise
  console.log(user);
  // Sjekk om passordet samsvarer med hash'en i databasen
  if ((!user && !await bcrypt.compare(password, user.password))){
    user = null
  }
  return user[0];
}

async function registerUser(username, password) {
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const result = await sqlm.addUser(username, hashedPassword, 0); // Ensure this returns a promise
  console.log(result);
  return result;
}

// Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
   
  if ( !req.session || !req.session.user) {
    return res.redirect("/login.html"); // Redirect to login page
  }
  next();
}

app.get('/getgames', requireLogin, async (req, res) => {
    console.log('/getgames/')

    const games = sqlm.getGames()
    
    res.send(games)
  });

  app.get('/getleaderboard', requireLogin, async (req, res) => {
    console.log('/getleaderboard/')

    const leaderBoard = sqlm.getLeaderboard()
    
    res.send(leaderBoard)
  });

// Protected Game Route (ensures only logged-in users can access games)
app.get("/playgame/", requireLogin, (req, res) => {
  const game = req.query.game
  const gamePath = path.join(__dirname, "public", game, "index.html");
  res.sendFile(gamePath);
});

app.post("/postresult/", requireLogin, (req, res) => {
  const { game, win } = req.body;
  console.log(game, "win", win)
  sqlm.postResult(req.session.user.userid, game, win)
  //res.sendFile(path.join(staticPath, 'app.html'));
  return res.redirect("/"); 
  
});


app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'));
});

// Start Server
app.listen(3000, () => console.log('Server is running on http://localhost:3000/'));
