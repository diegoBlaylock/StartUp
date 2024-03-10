import {Table, getTable, saveTable, findByColumn, contains} from '../database/database.js'
import {MissingParameterError, BadParameterError, ValueTakenError, UnauthorizedError} from './errors.js'
import { User, Credentials, AuthToken } from '../models/models.js';
import { checkToken, filterUserObj, findUserByID } from './service-utils.js';

export async function createUser(req) {

    if(req.username == null || req.email == null || req.password == null) {
        throw new MissingParameterError("Missing needed parameters!");
    }

    if (req.password.length < 8) {
        throw new BadParameterError("Password Length to Small");
    }

    const user_table = getTable(Table.USER);
    if(contains(user_table, "username", req.username)) {
        throw new ValueTakenError("Username Taken!");
    }

    if(contains(user_table, "email", req.email)) {
        throw new ValueTakenError("Email Taken!");
    }

    const new_user = new User(req.username, "/resources/default_profile.png", req.email, "");
    user_table.push(new_user);
    saveTable(Table.USER, user_table);
    
    let cred_table = getTable(Table.CREDENTIALS);
    const new_cred = new Credentials(new_user.userID, req.password);
    cred_table.push(new_cred);
    saveTable(Table.CREDENTIALS, cred_table);

    const token = new AuthToken(new_user.userID);
    let token_table = getTable(Table.TOKEN);
    token_table.push(token);
    saveTable(Table.TOKEN, token_table);

    return token;
}

export async function loginUser(req) {
    const user_table = getTable(Table.USER);
    const user = findByColumn(user_table, "username", req.username);

    if (user === null) {
        throw new BadParameterError("Username doesn't exist!");
    }
    
    const cred_table = getTable(Table.CREDENTIALS);
    const db_credentials = findByColumn(cred_table, "userID", user.userID);
    if (db_credentials.password !== req.password) {
        throw new BadParameterError("Password not Right!");
    }

    const token = new AuthToken(db_credentials.userID);
    let token_table = getTable(Table.TOKEN);
    token_table.push(token);
    saveTable(Table.TOKEN, token_table);

    return token;
}

export async function validateToken(req) {
    return checkToken(req.auth);
}

export async function logoutUser(req) {
    const token_table = getTable(Table.TOKEN);

    const index = token_table.map((t)=>t.token).indexOf(req.auth);
    if (index !== -1) {
        token_table.splice(index, 1);
        saveTable(Table.TOKEN, token_table);
    } else {
        throw new UnauthorizedError();
    }
}

export async function editUser(req) {
    const token = checkToken(req.auth);
    const user = findUserByID(token.userID);
    
    if (req.profile != null) {
        if(await isUrlValid(req.profile)) {
            user.profile = req.profile;
        } else {
            throw new BadParameterError("URL is not an image.")
        }
        
    }
    
    if (req.description != null) {
        user.description = req.description;
    }

    return user;
}

export async function getUser(req) {
    const token = checkToken(req.auth);
    const user = findUserByID(token.userID);
    
    if(user.userID !== token.userID) {
        return filterUserObj(user);
    }

    return user;
}

async function isUrlValid(url) {
    try {
        const response = await fetch(url, {method: "HEAD"});
        const type = response.headers.get("Content-Type");
        return type.startsWith("image/");
    } catch {
        return false;
    }
}
