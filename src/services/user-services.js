import {getTable, saveTable, findByColumn, contains} from '../database/database.js'
import {MissingParameterError, BadParameterError, ValueTakenError} from './errors.js'

export function createUser(req) {

    if(req.username == null || req.email == null || req.password == null) {
        throw new MissingParameterError("Missing needed parameters!");
    }

    if (req.password.length < 8) {
        throw new BadParameterError("Password Length to Small");
    }

    const user_table = getTable(Table.USER);
    if(contains(user, username, req.username)) {
        throw new ValueTakenError("Username Taken!");
    }

    const email_user = findByColumn(user_table, "email", user_details.email);
    if(email_user !== null) {
        throw new ValueTakenError("Email Taken!");
    }

    const new_user = new User(user_details.username, crypto.randomUUID(), "/resources/default_profile.png", "");
    user_table.push(new_user);
    saveTable(Table.USER, user_table);
    
    let cred_table = getTable(Table.CREDENTIALS);
    const new_cred = new Credentials(new_user.user_id, new_user.username, user_details.password);
    cred_table.push(new_cred);
    saveTable(Table.CREDENTIALS, cred_table);

    const token = new AuthToken(new_user.user_id, crypto.randomUUID());
    let token_table = getTable(Table.TOKEN);
    token_table.push(token);
    saveTable(Table.TOKEN, token_table);
}

export function loginUser(req) {
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
    saveTable(Table.TOKEN, token_table);

    const user_table = getTable(Table.USER);
    const user = findByColumn(user_table, "user_id", token.user_id);
}

export function logoutUser(req) {
    const token_table = getTable(Table.TOKEN);
    const index = token_table.map((t)=>t.token).indexOf(token.token);
    if (index !== -1) {
        token_table.splice(index, 1);
        saveTable(Table.TOKEN, token_table);
    }

    localStorage.removeItem(Store.TOKEN);
    localStorage.removeItem(Store.USER);
}

export function editUser(req) {
    const user_table = getTable(Table.USER);
    const index = user_table.map((t)=>t.user_id).indexOf(user_id);
    user_table[index].profile = url;
    saveTable(Table.USER, user_table);
    const user = user_table[index];

    //

    user_table[index].description = bio;
    saveTable(Table.USER, user_table);
}
