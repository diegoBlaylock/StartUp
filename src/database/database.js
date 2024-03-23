import * as mongodb from 'mongodb';
import config from './dbConfig.json' with { type: "json" };

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new mongodb.MongoClient(url);
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
    const cursor = roomCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return await cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}


const PAGE_SIZE = 9
import { Sort, Filter } from '../services/room-services.js'
export async function getPage(page, sortType, filterType, filterVal) {
    const aggregated = roomCollection
        .aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "ownerID",
                    foreignField: "_id",
                    as: "ownerID"
                }
            },
            {
                $toLower: "$username"
            }
        ])
    const query = {};

    if(filterVal) {
        switch(filterType) {
            case Filter.USER:
                query['username'] = filterVal.toLowerCase();
                break;
            case Filter.ROOM:
                query['title'] = filterVal.toLowerCase();
                break;
        }
    }
    
    let cursor = aggregated.find(query);

    try {
        const num_pages = Math.ceil(cursor.count()/PAGE_SIZE);

        if(page !== 0 && page >= total) {
            page = total-1;
        } 
        
        switch(sortType) {
            case Sort.TIME_STAMP:
                cursor = cursor.sort({timeStamp:-1});
                break;
            case Sort.POPULARITY:
                cursor = cursor.sort({title: 1});
                break;
        }
        cursor = cursor
            .skip(PAGE_SIZE*page)
            .limit(PAGE_SIZE);

        return new Page(await cursor.toArray(), page, num_pages);
    } finally {
        cursor.close();
    }
}

export async function getMessageThreadByRoomID(roomID) {
    const query = { threadID: roomID };
    const cursor = messageCollection
        .find(query, options)
        .sort({timeStamp:-1})
        .limit(100)
        .sort({timeStamp: 1});

    try {
        return await cursor.toArray();
    } finally {
        cursor.close();
    }
}

export async function addToken(token) {
    const result = await tokenCollection.insertOne(token);
    return result;
}

export async function getToken(token) {
    const query = { _id: token };
    const cursor = await tokenCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return await cursor.next();
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
    const cursor = userCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return await cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}

export async function getUserByUsername(username) {
    const query = { username: username };
    const cursor = userCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return await cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}

export async function doesUserWithUsernameExist(username) {
    const query = { username: username };
    const cursor = userCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return true;
        }

        return false;
    } finally {
        cursor.close();
    }
}

export async function doesUserWithEmailExist(email) {
    const query = { email: email };
    const cursor = userCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return true;
        }

        return false;
    } finally {
        cursor.close();
    }
}

export async function updateUserProfile(userID, profile) {
    return await userCollection.updateOne(
        { _id: userID },
        {
            $set: {profile: profile}
        }
    );
}

export async function updateUserBio(userID, bio) {
    return await userCollection.updateOne(
        { _id: userID },
        {
            $set: {description: bio}
        }
    );
}

export async function addCredential(credential) {
    const result = await credentialCollection.insertOne(credential);
    return result;
}

export async function getCredentialByUserID(userID) {
    const query = { _id: userID };
    const cursor = credentialCollection.find(query);
    try {
        if (await cursor.hasNext()) {
            return await cursor.next();
        }

        return null;
    } finally {
        cursor.close();
    }
}