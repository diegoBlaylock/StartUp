export class LoginRequest {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

export class CreateUserRequest {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}