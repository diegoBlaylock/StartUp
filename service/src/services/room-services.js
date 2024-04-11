import { Page, Room } from "../models/models.js";
import { BadParameterError, ResourceNotFoundError } from "./errors.js";
import { checkToken, findRoomByID, inflateWithOwner } from "./service-utils.js";
import * as database from '../database/database.js'
import { addRoom } from "../wsockets/socket-pool.js";


export async function getRoomInfo(req) {
    const [token, room] = await Promise.all([checkToken(req.auth), findRoomByID(req.roomID)]);
    if(room == null) throw new ResourceNotFoundError("Couldn't find room!")
    const inflated = await inflateWithOwner(room);
    if (inflated.owner._id !== token.userID) delete inflated.owner._id;
    return inflated;
}

export async function createRoom(req) {
    const token = await checkToken(req.auth);

    const room = new Room(
        token.userID,
        req.title,
        req.description,
    );
    
    database.addRoom(room);
    addRoom(room._id);
    return room._id;
}

async function getPagesFromReq(req) {
    const filterType = req.filterType;
    const filterVal = req.filterVal;
    const sortType = req.sortType;

    const page = req.page ?? 0;
    
    if (!Object.values(Filter).includes(filterType)) {
        throw new BadParameterError("Couldn't understand filterType " + filterType);
    }

    if (!Object.values(Sort).includes(sortType)) {
        throw new BadParameterError("Couldn't understand sortType " + sortType);
    }
    return await database.getPage(page, sortType, filterType, filterVal);
}

export async function dicoverRooms(req) {
    const[pageObj, _token] = await Promise.all([getPagesFromReq(req), checkToken(req.auth)]);
    return pageObj;
}

export async function getChatHistory(req) {
    const [_token, messageTable] = await Promise.all([
        checkToken(req.auth), 
        database.getMessageThreadByRoomID(req.threadID)
    ]);
    return messageTable;
}

export const Sort = Object.freeze({
    POPULARITY: "popularity",
    TIME_STAMP: "timeStamp"
});

export const Filter = Object.freeze({
    USER: "user",
    ROOM: "room"
});