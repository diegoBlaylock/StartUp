import { Page, Room } from "../models/models.js";
import { BadParameterError, ResourceNotFoundError } from "./errors.js";
import { checkToken, filterUserObj, findRoomByID, inflateWithOwner } from "./service-utils.js";
import * as database from '../database/database.js'


export async function getRoomInfo(req) {
    await checkToken(req.auth);
    const room = await findRoomByID(req.roomID);
    if(room == null) throw new ResourceNotFoundError("Couldn't find room!")
    return await inflateWithOwner(room);
}

export async function createRoom(req) {
    const token = await checkToken(req.auth);

    const room = new Room(
        token.userID,
        req.title,
        req.description,
    );
    
    await database.addRoom(room);

    return room._id;
}

export async function dicoverRooms(req) {
    await checkToken(req.auth);

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
    const pageObj = await database.getPage(page, sortType, filterType, filterVal);

    // pageObj.rooms = pageObj.rooms.map((room)=>{
    //     room.owner = filterUserObj(room.owner);
    //     return room;
    // });

    return pageObj;
}

export async function getChatHistory(req) {
    await checkToken(req.auth);

    const messageTable = await database.getMessageThreadByRoomID(req.threadID);
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