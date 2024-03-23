import {MissingParameterError, BadParameterError, ValueTakenError, ResourceNotFoundError} from './errors.js'
import { User, Credentials, AuthToken } from '../models/models.js';
import { checkToken, filterUserObj, findUserByID } from './service-utils.js';
import * as database from '../database/database.js'


export async function createUser(req) {

    if(req.username == null || req.email == null || req.password == null) {
        throw new MissingParameterError("Missing needed parameters!");
    }

    if (req.password.length < 8) {
        throw new BadParameterError("Password Length to Small");
    }

    if(await database.doesUserWithUsernameExist(req.username)) {
        throw new ValueTakenError("Username Taken!");
    }

    if(await database.doesUserWithEmailExist(req.email)) {
        throw new ValueTakenError("Email Taken!");
    }

    const new_user = new User(req.username, "/resources/default_profile.png", req.email, "");
    await database.addUser(new_user);
    
    const new_cred = new Credentials(new_user._id, req.password);
    await database.addCredential(new_cred);

    const token = new AuthToken(new_user._id);
    await database.addToken(token);

    return token;
}

export async function loginUser(req) {
    const user = await database.getUserByUsername(req.username);

    if (user == null) {
        throw new BadParameterError("Username doesn't exist!");
    }
    
    const db_credentials = await database.getCredentialByUserID(user._id);
    if (db_credentials.password !== req.password) {
        throw new BadParameterError("Password not Right!");
    }

    const token = new AuthToken(db_credentials._id);
    await database.addToken(token);

    return token;
}

export async function validateToken(req) {
    return await checkToken(req.auth);
}

export async function logoutUser(req) {
    await checkToken(req.auth);
    const result = await database.deleteToken(req.auth);
}

export async function editUser(req) {
    const token = await checkToken(req.auth);
    const user = await findUserByID(token.userID);
    
    if (req.profile != null) {
        if(await isUrlValid(req.profile)) {
            user.profile = req.profile;
            await database.updateUserProfile(user._id, req.profile);
        } else {
            throw new BadParameterError("URL is not an image.");
        }
        
    }
    
    if (req.description != null) {
        user.description = req.description;
        await database.updateUserBio(user._id, req.description);
    }

    return user;
}

export async function getUser(req) {
    const token = await checkToken(req.auth);
    const user = await findUserByID(req.userID);
    
    if (user == null) throw new ResourceNotFoundError("Couldn't find User!");
    if(user._id !== token.userID) {
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
