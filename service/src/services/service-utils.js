import { UnauthorizedError } from "./errors.js";
import * as database from '../database/database.js'

export async function findToken(tok) {
    const token = await database.getToken(tok);
    return token;
}

export async function checkToken(tok) {
    const token = await findToken(tok);

    if (token == null) {
        throw new UnauthorizedError();
    }

    return token;
}

export async function findUserByID(userID) {
    return await database.getUserByID(userID);
}

export function filterUserObj(user) {
    delete user.email;
    return user;
}

export async function findRoomByID(roomID) {
    return await database.getRoomByID(roomID);
}

export async function inflateWithOwner(obj) {
    const owner = filterUserObj(await findUserByID(obj.ownerID));
    if (obj == null) return null;
    if(!obj.owner) obj.owner = owner;
    delete obj.ownerID;
    return obj;
}