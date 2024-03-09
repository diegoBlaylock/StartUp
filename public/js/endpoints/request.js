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

export class GetUserRequest {
    constructor(userID) {
        this.userID = userID;
    }
}

export class CreateRoomRequest {
    constructor(title, desc) {
        this.title = title;
        this.description = desc;
    }
}

export const Filter = Object.freeze({
    POPULARITY: "popularity",
    TIME_STAMP: "time_stamp"
});

export const Search = Object.freeze({
    USER: "user",
    ROOM: "room"
});

export class RoomRequest {
    constructor(page, filter_type, search_type, search_param) {
        this.page = page;
        this.filter_type = filter_type;
        this.search_type = search_type;
        this.search_param = search_param;
    }
}