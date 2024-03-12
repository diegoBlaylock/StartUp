import { getTable, findByColumn, Table } from "../database/database.js";
import { UnauthorizedError } from "./errors.js";

export function findToken(tok) {
    const tokenTable = getTable(Table.TOKEN);
    const token = findByColumn(tokenTable, "token", tok);

    return token;
}

export function checkToken(tok) {
    const token = findToken(tok);

    if (token == null) {
        throw new UnauthorizedError();
    }

    return token;
}

export function findUserByID(userID) {
    const userTable = getTable(Table.USER);
    const user = findByColumn(userTable, "userID", userID);
    return user;
}

export function filterUserObj(user) {
    const filtered = {...user}
    filtered.email = undefined;
    return filtered;
}

export function findRoomByID(roomID) {
    const roomTable = getTable(Table.ROOM);
    const room = findByColumn(roomTable, "roomID", roomID);
    return room;
}

export function inflateWithOwner(obj) {
    const owner = filterUserObj(findUserByID(obj.ownerID));
    obj = {...obj};
    if (obj == null) return null;
    if(!obj.owner) obj.owner = owner;
    return obj;
}