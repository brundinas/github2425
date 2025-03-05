CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    idRole INTEGER,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (idRole) REFERENCES role(id)
);

CREATE TABLE activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUser INTEGER,
    timeplayed DATETIME NOT NULL,
    idGame INTEGER,
    won TINYINT, 
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idGame) REFERENCES game(id)
  
);
