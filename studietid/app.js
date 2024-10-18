
require('dotenv').config(); // Load environment variables
const saltRounds = 10;
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const sqlm = require('./sqlm.js');

//const db = sqlm.db;

const app = express();
const bcrypt = require('bcrypt');

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


const staticPath = path.join(__dirname, 'public');
app.use(express.urlencoded({ extended: true })); // To parse urlencoded parameters
app.use(express.json()); // To parse JSON bodies




// Middleware to check if the user is logged in
function checkLoggedIn(req, res, next) {
    if (req.session.loggedIn) {
        console.log('Bruker logget inn:', req.user);
        return next();
    } else {
        res.redirect('/login.html');
    }
}


function checkAdmin(req, res, next) {
    if (req.session.loggedIn & req.session.user.role == 'Administrator') { 
        return next();
    } else {
        res.redirect('/app.html');
    }
}


// Rute for innlogging
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    //update user set password = '$2b$10$OaYrsjfSOxIlRl3l6brlTe4erojrTxjgsYSzUNF.uCa9Ny9XMmXoS'
    //passord = Passord123
    
    // Finn brukeren basert på brukernavn
    const user = await sqlm.getUserByEmail(email); // Ensure this returns a promise
    console.log(user);
    if (!user) {
        return res.status(401).send('Ugyldig brukernavn');
    }

    // Sjekk om passordet samsvarer med hash'en i databasen
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // Lagre innloggingsstatus i session
        req.session.loggedIn = true;
        req.session.user = user;
        if (user.role == 'Administrator') {
            res.redirect('/admin'); // Ensure the correct path to the admin HTML file
        } else {
            res.sendFile(path.join(staticPath, 'app.html'));
        }
    } else {
        return res.status(401).send('Ugyldig passord');
    }
});


// Beskyttet rute som krever at brukeren er innlogget
app.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
        res.send(`Velkommen, ${req.session.username}!`);
    } else {
        res.status(403).send('Du må være logget inn for å se denne siden.');
    }
});

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'));
});

app.get('/admin/', checkLoggedIn, checkAdmin, (req, res) => {
    console.log('admin');
    res.sendFile(path.join(staticPath, 'admin', 'index.html')); // Ensure the correct path to the admin HTML file
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/addactivity/', checkLoggedIn,(req, res) => {
    // Insert new activity
    const { idUser, idRoom, idSubject } = req.body;
    console.log('addactivity', req.body)
    const newActivity = sqlm.addActivity(idUser, idRoom, idSubject);

    if (!newActivity) {
         return res.json({ error: 'Failed to register activty.' });
    }
    else res.send(newActivity)    
 

})




app.post('/adduser', checkLoggedIn,(req, res) => {
    const { firstName, lastName, email } = req.body;

    // Validate email format and check if email already exists
    if (!sqlm.checkValidEmailFormat(email)) {
        return res.json({ error: 'Invalid email format.' });
    }
    else 
    if (!sqlm.checkEmailExists(email)) {
        //return res.json({ error: 'Email already exists.' });

        res.redirect('/app.html?errorMsg=EmailExist');
    }
    else {
        // Insert new user
        const newUser = sqlm.addUser(firstName, lastName, 2, 0, email);

        if (!newUser) {
            return res.json({ error: 'Failed to register user.' });
        }
    
        res.sendFile(path.join(staticPath, 'app.html'))

        //return res.json({ message: 'User registered successfully!', user: newUser });
}
    

});



app.get('/getusers/', checkLoggedIn, (req, resp) => {
    console.log('/getusers/')

    const users = sqlm.getUsers
    
    resp.send(users)
})

app.get('/getrooms/', (req, resp) => {
    console.log('/getrooms/')
    rooms = sqlm.getRooms()
    
    resp.send(rooms)
})

app.get('/getsubjects/', (req, resp) => {
    console.log('/getsubjects/')
    subjects = sqlm.getSubjects()

    
    resp.send(subjects)
})


app.get('/getactivites/', checkLoggedIn,(req, resp) => {
    console.log('/getactivities/')
    const idUser = 1
    const sql = db.prepare(`SELECT starttime, room.name as rom, subject.name as fag, status.name as status
                            FROM activity
                            inner join room on room.id = activity.idRoom
                            inner join subject on subject.id = activity.idSubject
                            inner join user on user.id = activity.idUser
                            inner join status on status.id = activity.idStatus
                            where user.id = ?`);
    let activities = sql.all(idUser)   
    console.log("users.length", activities.length)
    
    resp.send(activities)
})

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})