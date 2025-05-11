require('dotenv').config(); // Load environment variables
const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlm = require('./sqlm.js');
const bcrypt = require("bcrypt")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true); // Important if behind a reverse proxy (e.g. Nginx)



app.use(session({
  secret: process.env.SECRET_KEY,  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to `true` if using HTTPS
}));


app.use((req, res, next) => {
  if (!req.session || !req.session.user) return next(); // Skip if not logged in
  console.log('req.ip', req.ip)
  const logStmt = sqlm.getDB().prepare(`
    INSERT INTO usage_log (user_id, session_id, ip, path, method)
    VALUES (?, ?, ?, ?, ?)
  `);

  logStmt.run(
    req.session.user.userid,
    req.sessionID,
    req.ip, 
    req.path,
    req.method
  );

  next();
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  const user = await findUser(username, password);

  if (user) {
    user.password = ""
    req.session.user = user;
    res.status(200) //OK
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

  const user = await sqlm.getUserByUsername(username); // Ensure this returns a promise
  console.log(user);
  // Sjekk om passordet samsvarer med hash'en i databasen
  if ((!user && !await bcrypt.compare(password, user.password))){
    user = null
  }
  return user;
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


function requireAdmin(req, res, next) {
   
  if ( !req.session.user.isadmin) {
    return res.status(403).send("Forbidden");
  }
  next();
}


app.get('/getgames', requireLogin, async (req, res) => {
  try {
    const games = await sqlm.getGames();
    res.send(games);
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
  
  });

  app.get('/getleaderboard', requireLogin, async (req, res) => {
    console.log('/getleaderboard/')
    
    try {
      const leaderBoard = await sqlm.getLeaderboard()
      res.send(leaderBoard)
    } catch (err) {
      res.status(500).send({ error: "Server error" });
    }
    
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
  try {
    sqlm.postResult(req.session.user.userid, game, win)
    return res.redirect("/"); 
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
  
  
});


app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'));
});


app.get('/admin/logs', requireLogin, requireAdmin, (req, res) => {

  const logs = sqlm.getDB().prepare(`
    SELECT usage_log.*, user.username
    FROM usage_log
    LEFT JOIN user ON usage_log.user_id = user.id
    ORDER BY timestamp DESC LIMIT 100
  `).all();

  res.json(logs);
});

const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath))

// Start Server
app.listen(3000, () => console.log('Server is running on http://localhost:3000/'));
