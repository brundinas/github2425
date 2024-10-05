
const path = require('path')

const express = require('express')
const app = express()

const sqlm = require('./sqlm.js');

const staticPath = path.join(__dirname, 'public')
app.use(express.urlencoded({ extended: true })) // To parse urlencoded parameters
app.use(express.json()); // To parse JSON bodies


app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'app.html'))
})

app.get('/admin/', (req, res) => {
    console.log('admin')
    res.sendFile(path.join(staticPath, './admin/'))
})

app.post('/addactivity/', (req, res) => {
    // Insert new activity
    const { idUser, idRoom, idSubject } = req.body;
    console.log('addactivity', req.body)
    const newActivity = sqlm.addActivity(idUser, idRoom, idSubject);

    if (!newActivity) {
         return res.json({ error: 'Failed to register activty.' });
    }
    else res.send(newActivity)    
     //res.sendFile(path.join(staticPath, 'app.html'))
    
        //return res.json({ message: 'User registered successfully!', user: newUser });
      

})




app.post('/adduser', (req, res) => {
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



app.get('/getusers/', (req, resp) => {
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