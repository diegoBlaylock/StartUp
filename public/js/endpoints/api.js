import {getTable, Table, findByColumn, safeTable} from "../mocks/database.js"
import {Store, save} from "../local-store.js"
import { AuthToken } from "../models/user.js";

export function login(credentials) {
    cred_table = getTable(Table.CREDENTIALS);
    const db_credentials = findByColumn(cred_table, "username", credentials.username);
    if(db_credentials === null) {
        throw "Username does not exist!";
    } else if (db_credentials.password !== credentials.password) {
        throw "Password not Right!";
    }

    token = new AuthToken(db_credentials.user_id, crypto.randomUUID());
    token_table = getTable(Table.TOKEN);
    token_table.push(token);
    safeTable(Table.TOKEN, token_table);
    save(Store.TOKEN, token);

    user_table = getTable(Table.USER);
    user = findByColumn(user_table, "user_id", token.user_id);
    save(Store.USER, user);

    return user;
}

export function validate_token(token) {
    token_table = getTable(Table.TOKEN);
    const db_token = findByColumn(token_table, "token", token);
    if(index === null) {
        localStorage.removeItem(Store.TOKEN);
        throw "Not Valid";
    }
    save(Store.TOKEN, db_token);

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