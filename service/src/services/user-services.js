import {MissingParameterError, BadParameterError, ValueTakenError, ResourceNotFoundError} from './errors.js'
import { User, Credentials, AuthToken } from '../models/models.js';
import { checkToken, filterUserObj, findUserByID } from './service-utils.js';
import * as database from '../database/database.js'
import * as bcrypt from 'bcrypt'

export async function createUser(req, res) {

    if(req.username == null || req.email == null || req.password == null) {
        throw new MissingParameterError("Missing needed parameters!");
    }

    if (req.password.length < 8) {
        throw new BadParameterError("Password Length to Small");
    }

    async function checkUsername() {
        if(await database.doesUserWithUsernameExist(req.username)) {
            throw new ValueTakenError("Username Taken!");
        }
    }

    async function checkEmail() {
        if(await database.doesUserWithEmailExist(req.email)) {
            throw new ValueTakenError("Email Taken!");
        }
    }

    await Promise.all([checkUsername(), checkEmail()]);

    const new_user = new User(req.username, "/resources/default_profile.png", req.email, "");
    database.addUser(new_user);
    
    const new_cred = new Credentials(new_user._id, req.password);
    database.addCredential(new_cred);

    const token = new AuthToken(new_user._id);
    database.addToken(token);

    res.cookie("token", token.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });

    return {userID: token.userID};
}

export async function loginUser(req, res) {
    const user = await database.getUserByUsername(req.username);

    if (user == null) {
        throw new BadParameterError("Username doesn't exist!");
    }

    async function checkCredentials() {
        const db_credentials = await database.getCredentialByUserID(user._id);
        if (! await bcrypt.compare(req.password, db_credentials.password)) {
            throw new BadParameterError("Password not Right!");
        }

        return db_credentials;
    }
    
    let [db_credentials, token] = await Promise.all([
        checkCredentials(),
        database.getTokenByID(user._id)
    ]);
 
    if(token == null) {
        token = new AuthToken(db_credentials._id);
        await database.addToken(token);
    }

    res.cookie("token", token.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });

    return {userID: token.userID};;
}

export async function validateToken(req) {
    const token = await checkToken(req.auth);
    return {userID: token.userID}
}

export async function logoutUser(req, res) {
    const token = await checkToken(req.auth);
    await database.deleteToken(token.userID);
    res.clearCookie("token");
}

export async function editUser(req) {
    const token = await checkToken(req.auth);
    const user = await findUserByID(token.userID);
    
    if (req.profile != null) {
        if(await isUrlValid(req.profile)) {
            user.profile = req.profile;
            database.updateUserProfile(user._id, req.profile);
        } else {
            throw new BadParameterError("URL is not an image.");
        }
        
    }
    
    if (req.description != null) {
        user.description = req.description;
        database.updateUserBio(user._id, req.description);
    }

    return user;
}

export async function getUser(req) {
    const [token, user] = await Promise.all([checkToken(req.auth), findUserByID(req.userID)]);
    if (user == null) throw new ResourceNotFoundError("Couldn't find User!");
    const filter = filterUserObj(user);
    if (token.userID !== user._id)
        delete filter._id;
    return filter;
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
