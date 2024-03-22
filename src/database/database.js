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

export async function addRoom(room) {
    const result = await roomCollection.insertOne(room);
    return result;
}

export async function getRoomByID(roomID) {
    const query = { _id: roomID };
    const cursor = await roomCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}

export async function getPage(){

}

export async function getMessageThreadByRoomID(roomID) {
    
}

export async function addToken(token) {
    const result = await tokenCollection.insertOne(token);
    return result;
}

export async function getToken(token) {
    const query = { _id: token };
    const cursor = await tokenCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}

export async function deleteToken(token) {
    const query = { _id: token };
    const result = await roomCollection.remove(query);
    return result;
}

export async function addUser(user) {
    const result = await userCollection.insertOne(user);
    return result;
}

export async function getUserByID(userID) {
    const query = { _id: userID };
    const cursor = await userCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}

export async function getUserByUsername(username) {
    const query = { username: username };
    const cursor = await userCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}

export async function doesUserWithUsernameExist(username) {
    const query = { username: username };
    const cursor = await userCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return true;
        }

        return false;
    } finally {
        cursor.close();
    }
}

export async function doesUserWithEmailExist(email) {
    const query = { email: email };
    const cursor = await userCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return true;
        }

        return false;
    } finally {
        cursor.close();
    }
}

export async function addCredential(credential) {
    const result = await credentialCollection.insertOne(credential);
    return result;
}

export async function getCredentialByUserID(userID) {
    const query = { _id: userID };
    const cursor = await credentialCollection.find(query);
    try {
        if (cursor.hasNext()) {
            return cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}