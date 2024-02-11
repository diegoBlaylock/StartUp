import {getTable, Table, findByColumn, safeTable} from "../mocks/database.js"
import {Credentials} from "../mocks/server-models.js"
import {Store, save} from "../local-store.js"
import { AuthToken, User } from "../models/user.js";

export function login(credentials) {
    const cred_table = getTable(Table.CREDENTIALS);
    const db_credentials = findByColumn(cred_table, "username", credentials.username);
    if(db_credentials === null) {
        throw "Username does not exist!";
    } else if (db_credentials.password !== credentials.password) {
        throw "Password not Right!";
    }

    const token = new AuthToken(db_credentials.user_id, crypto.randomUUID());
    let token_table = getTable(Table.TOKEN);
    token_table.push(token);
    safeTable(Table.TOKEN, token_table);
    save(Store.TOKEN, token);

    const user_table = getTable(Table.USER);
    user = findByColumn(user_table, "user_id", token.user_id);
    save(Store.USER, user);
}

export function validate_token(token) {
    const token_table = getTable(Table.TOKEN);
    const db_token = findByColumn(token_table, "token", token.token);
    if(db_token === null || db_token.user_id !== token.user_id) {
        localStorage.removeItem(Store.TOKEN);
        throw "Not Valid";
    }
    save(Store.TOKEN, db_token);

    const user_table = getTable(Table.USER);
    const user = findByColumn(cred_table, "user_id", token.user_id);
    save(Store.USER, user);
}

export function create_user(user_details) {
    
    let user_table = getTable(Table.USER);
    user = findByColumn(user_table, "username", user_details.username);
    if(user !== null) {
        throw "Username taken!"
    }

    const new_user = new User(user_details.username, crypto.randomUUID(), "/resources/default_profile.png", "");
    user_table.push(new_user);
    safeTable(Table.USER, user_table);
    save(Store.USER, new_user);
    
    let cred_table = getTable(Table.CREDENTIALS);
    const new_cred = new Credentials(new_user.user_id, new_user.username, user_details.password);
    cred_table.push(new_cred);
    safeTable(Table.CREDENTIALS, cred_table);

    const token = new AuthToken(new_user.user_id, crypto.randomUUID());
    let token_table = getTable(Table.TOKEN);
    token_table.push(token);
    safeTable(Table.TOKEN, token_table);
    save(Store.TOKEN, token);

}

export function sign_out() {
    const token = get(Store.TOKEN);
    const token_table = getTable(Table.TOKEN);
    const index = token_table.map((t)=>t.token).indexOf(token.token);
    if (index !== -1) {
        token_table.splice(index, 1);
        safeTable(Table.TOKEN, token_table);
    }

    localStorage.removeItem(Store.TOKEN);
    localStorage.removeItem(Store.USER);

}

export function edit_user_picture(user_id, file) {

}

export function edit_user_bio(user_id, bio) {

}

export function get_room_stats(room_id) {

}