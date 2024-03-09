export class User {
    constructor(username, userID, profile, email, description) {
        this.username = username;
        this.userID = userID;
        this.profile = profile;
        this.email = email;
        this.description = description;
    }
}

export class Credentials {
    constructor(userID, password) {
        this.userID = userID;
        this.password = password;
    }
}

export class AuthToken {
    constructor(userID, token, timestamp) {
        this.userID = userID;
        this.token = token;
        this.time = timestamp;
    }
}

class Room {}

class Page {}