// sqlm.js
const sqlite3 = require('better-sqlite3')
global.db  = sqlite3('./leaderboard.db', {verbose: console.log})




 function checkEmailExists(email) {

    let sql = global.db.prepare("select count(*)  as count from user where email = ?")
    let result = sql.get(email);
    console.log("result.count", result)
    if (result.count > 0) {
        console.log("Email already exists")
        return false;
    }
    return true;

}

function addUser(firstName, lastName, idRole, isAdmin, email)
 {


    sql = global.db.prepare("INSERT INTO user (firstName, lastName, idRole, isAdmin, email) " +
                         "values (?, ?, ?, ?, ?)")
    const info = sql.run(firstName, lastName, idRole, isAdmin, email)
    
    sql = global.db.prepare('SELECT user.id as userid, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id   WHERE user.id  = ?');
    let row = sql.all(info.lastInsertRowid)  
    console.log('row inserted', rows[0])

    return row
}

function getUserByEmail(email) {
    const sql = global.db.prepare('SELECT user.id as userid, password, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id  WHERE email = ?');
    let user = sql.get(email)   
    return user
}

function getUser(id) {
    const sql = global.db.prepare('SELECT user.id as userid, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id  WHERE user.id = ?');
    let user = sql.get(id)   
    return user
}

function checkValidEmailFormat(email) {
    const emailRegex = /^[^\s@\.][^\s@]*@[^\s@]+\.[^\s@]+$/;
    let result = emailRegex.test(email);
 
    if (!result) {
        return false;
    }
    else return true


}

//https://www.uib.no/ai/174952/ki-anno-2030-i-offentlighetens-interesse
function getUsers() {
    const sql = global.db.prepare('SELECT user.id as userid, firstname, lastname, role.name  as role ' + 
        'FROM user inner join role on user.idrole = role.id ');
    let users = sql.all()   
    return users
}


function getGames() {
    console.log('getGames')
    const sql = global.db.prepare('select id, name, url  from game');
    let games = sql.all()  
    return games
}

function addResult(idUser, idGame, result) {
    sql = global.db.prepare("INSERT INTO leaderboard (idUser, idGame, idResult) " +
        "values (?, ?, ?)")
const info = sql.run(idUser, idGame, result)



return row
}



module.exports = {
    getUser,
    getUserByEmail,
    getUsers,
    addUser,
    checkEmailExists,
    checkValidEmailFormat,
    addResult,
    getGames

};