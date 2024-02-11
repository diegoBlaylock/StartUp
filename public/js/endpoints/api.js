import {get_table, Table, findByColumn} from "../mocks/database"
import {Store, save} from "../local-store"

export function login(credentials) {
    cred_table = getTable(Table.CREDENTIALS);
    const credentials = findByColumn(cred_table, "username", credentials.username);
    if(credentials === null) {
        localStorage.removeItem(Store.TOKEN);
        throw "Username does not exist!";
    }
    save(Store.TOKEN, token.token);

    user_table = getTable(Table.USER);
    user = findByColumn(user_table, "user_id", token.user_id);
    save(Store.USER, user);

    return user;
}

export function validate_token(token) {
    token_table = getTable(Table.TOKEN);
    const token = findByColumn(token_table, "token", token);
    if(index === null) {
        localStorage.removeItem(Store.TOKEN);
        throw "Not Valid";
    }
    save(Store.TOKEN, token.token);

    user_table = getTable(Table.USER);
    user = findByColumn(cred_table, "user_id", token.user_id);
    save(Store.USER, user);

    return user;
}

export function create_user(user_details) { 

}

export function edit_user_picture(user_id, file) {

}

export function edit_user_bio(user_id, bio) {

}

export function get_room_stats(room_id) {

}