export class User {
    constructor(username, user_id, profile, description) {
        this.username = username;
        this.user_id = user_id;
        this.profile = profile;
        this.description = description;
    }
}

export class AuthToken {
    constructor(user_id, token) {
        this.user_id = user_id;
        this.token = token;
    }
}


