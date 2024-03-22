export class User {
    constructor(username, profile, email, description) {
        this.username = username;
        this._id = crypto.randomUUID();
        this.profile = profile;
        this.email = email;
        this.description = description;
    }
}

export class Credentials {
    constructor(userID, password) {
        this._id = userID;
        this.password = password;
    }
}

export class AuthToken {
    constructor(userID) {
        this.userID = userID;
        this.token = crypto.randomUUID();
        this._id = this.token;
        this.time = Date.now();
    }
}

export class Room {
    constructor(ownerID, title, description) {
        this.ownerID = ownerID;
        this._id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.timeStamp = Date.now();
    }
}

export class Page {
    constructor(rooms, num, total) {
        this.rooms = rooms;
        this.num = num;
        this.total = total;
    }
}

export class Message {
    constructor(ownerID, content, threadID) {
        this._id = crypto.randomUUID();
        this.ownerID = ownerID;
        this.content = content;
        this.timeStamp = Date.now();
        this.threadID = threadID;    
    }
}