const sqlite3 = require('better-sqlite3')
const path = require('path')
const db = sqlite3('./studietid.db', {verbose: console.log})
const express = require('express')
const app = express()

const staticPath = path.join(__dirname, 'public')
app.use(express.urlencoded({ extended: true })) // To parse urlencoded parameters
app.use(express.json()); // To parse JSON bodies


app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'))
})

app.get('/admin/', (req, res) => {
    console.log('admin')
    res.sendFile(path.join(staticPath, 'admin.html'))
})



function checkEmailExists(email) {

    let sql = db.prepare("select count(*)  as count from user where email = ?")
    let result = sql.get(email);
    console.log("result.count", result)
    if (result.count > 0) {
        console.log("Email already exists")
        return false;
    }
    return true;

}

function checkValidEmailFormat(email) {
    const emailRegex = /^[^\s@\.][^\s@]*@[^\s@]+\.[^\s@]+$/;
    let result = emailRegex.test(email);
 
    if (!result) {
        return false;
    }
    else return true


}


app.post('/adduser', (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Validate email format and check if email already exists
    if (!checkValidEmailFormat(email)) {
        return res.json({ error: 'Invalid email format.' });
    }
    else 
    if (!checkEmailExists(email)) {
        //return res.json({ error: 'Email already exists.' });

        res.redirect('/app.html?errorMsg=EmailExist');
    }
    else {
        // Insert new user
        const newUser = addUser(firstName, lastName, 2, 0, email);

        if (!newUser) {
            return res.json({ error: 'Failed to register user.' });
        }
    
        res.sendFile(path.join(staticPath, 'app.html'))

        //return res.json({ message: 'User registered successfully!', user: newUser });
}
    

});

function addUser(firstName, lastName, idRole, isAdmin, email)
 {


    sql = db.prepare("INSERT INTO user (firstName, lastName, idRole, isAdmin, email) " +
                         "values (?, ?, ?, ?, ?)")
    const info = sql.run(firstName, lastName, idRole, isAdmin, email)
    
    sql = db.prepare('SELECT user.id as userid, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id   WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  
    console.log('row inserted', rows[0])

    return rows[0]
}

app.get('/getusers/', (req, resp) => {
    console.log('/getusers/')

    const sql = db.prepare('SELECT user.id as userid, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id ');
    let users = sql.all()   
    console.log("users.length", users.length)
    
    resp.send(users)
})

app.get('/getrooms/', (req, resp) => {
    console.log('/getrooms/')

    const sql = db.prepare('select id, name  from room');
    let data = sql.all()   
    console.log("data.length", data.length)
    
    resp.send(data)
})

app.get('/getsubjects/', (req, resp) => {
    console.log('/getsubjects/')

    const sql = db.prepare('select id, name from subject');
    let data = sql.all()   
    console.log("data.length", data.length)
    
    resp.send(data)
})


app.get('/getactivites/', (req, resp) => {
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