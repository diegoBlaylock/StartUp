export class User {
    constructor(username, user_id, profile, email, description) {
        this.username = username;
        this.user_id = user_id;
        this.profile = profile;
        this.email = email;
        this.description = description;
    }
}

export class Credentials {
    constructor(user_id, password) {
        this.user_id = user_id;
        this.password = password;
    }
}

export class AuthToken {
    constructor(user_id, token, timestamp) {
        this.user_id = user_id;
        this.token = token;
        this.time = timestamp;
    }
}

class Room {}

class Page {}