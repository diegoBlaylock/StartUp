import * as mongodb from 'mongodb';
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new mongodb(url);
const db = client.db("cs260");

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

const userCollection = db.collection('users');
const tokenCollection = db.collection('tokens');
const roomCollection = db.collection('rooms');
const credentialCollection = db.collection('credentials');
const messageCollection = db.collection('messages');

export function addRoom(room) {

}

export function getRoomByID(roomID) {

}

export function getPage(){

}

export function getMessageThreadByRoomID(roomID) {

}

export function addToken(token) {

}

export function getToken(token) {

}

export function deleteToken(token) {
    
}

export function addUser(user) {

}

export function getUserByID(userID) {
    
}

export function doesUserWithUsernameExist(username) {
    
}

export function doesUserWithEmailExist(email) {
    
}

export function addCredential(credential) {

}

export function getCredentialByUsername(username) {

}



export const Table = Object.freeze({
    USER: "user_table",
    TOKEN: "token_table",
    ROOM: "room_table",
    CREDENTIALS: "credentials",
    MESSAGE: "message"
});

const tables = {}

export function getTable(name) {
    const table = tables[name];
    if (table == null) {
        tables[name] = []
        return tables[name];
    }
    return table;
}

export function saveTable(name, table) {
    tables[name] = table;
}

export function findByColumn(table, attribute, value) {
    for(const obj of table) {
        if(obj[attribute] === value) {
            return obj;
        }
    }

    return null;
}

export function contains(table, attribute, value) {
    for(const obj of table) {
        if(obj[attribute] === value) {
            return true;
        }
    }

    return false;
}
