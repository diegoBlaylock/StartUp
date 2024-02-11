export class User {
    username;
    user_id;
    profile;
    description;
}

export class AuthToken {
    constructor(user_id, token) {
        this.user_id = user_id;
        this.token = token;
    }
}


