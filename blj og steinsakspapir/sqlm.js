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

function addUser(username, password, isAdmin)
 {
    try {
    sql = global.db.prepare("INSERT INTO user (username, password, isAdmin) " +
                         "values (?, ?, ?)")
    const info = sql.run(username, password, isAdmin)
    

    sql = global.db.prepare('SELECT id as userid, username, isadmin' + 
        'FROM user  WHERE user.id  = ?');
    let row = sql.all(info.lastInsertRowid)  
    console.log('row inserted', rows[0])

    return row
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT' || err.code === 'SQLITE_CONSTRAINT_UNIQUE' ) {
            console.error('Error: Duplicate username.');
            return { error: 'Brukernavn finnes allerede' };
        } else {
            console.error('Database error:', err);
            return { error: 'Database error' };
        }
    }
}

function getUserByUsername(username) {
    const sql = global.db.prepare('SELECT user.id as userid, password, username, isAdmin ' + 
        'FROM user  WHERE username = ?');
    let user = sql.get(username)   
    return user
}


function getUser(id) {
    const sql = global.db.prepare('SELECT user.id as userid, username, isAdmin ' + 
        'FROM user WHERE user.id = ?');
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
    const users = sql.all()   
    return users
}


function getGames() {
    const sql = global.db.prepare('select id, name, url  from game');
    const games = sql.all()  
    return games
}

function getLogs() {
    const sql = global.db.prepare(`
        SELECT usage_log.*, user.username
        FROM usage_log
        LEFT JOIN user ON usage_log.user_id = user.id
        ORDER BY timestamp DESC LIMIT 100
      `)
      const logs = sql.all()  
    return logs
}

function log(req){
    const sql = global.db.prepare(`
        INSERT INTO usage_log (user_id, session_id, ip, path, method)
        VALUES (?, ?, ?, ?, ?)
      `);
    
      sql.run(
        req.session.user.userid,
        req.sessionID,
        req.ip, 
        req.path,
        req.method
      );
}

function getLeaderboard() {
    console.log('getLeaderboard')
    const sql = global.db.prepare('select game.name as game, count(idGame) as countPlayed, sum(won) as score, idUser, username ' +
                'from activity ' +
                'inner join user on idUser = user.id ' +
                'inner join game on idGame = game.id ' +
                'group by idUser, idGame, game.name')
    const leaderboard = sql.all()  
    return leaderboard
}


function postResult(idUser, game, result) {
    const sqlgameid = global.db.prepare('select id from game where url = lower(?)')
    const gameid = sqlgameid.all(game)  
    const sql = global.db.prepare("INSERT INTO activity (idUser, timeplayed, idGame, won) " +
        "values (?, CURRENT_TIMESTAMP, ?, ?)")
const info = sql.run(idUser, gameid[0].id, result)

}

function getDB() {
    return global.db;
}

module.exports = {
    getUser,
    getUserByUsername,
    getUsers,
    addUser,
    checkEmailExists,
    checkValidEmailFormat,
    postResult,
    getLeaderboard,
    getGames,
    getLogs,
    log

};


