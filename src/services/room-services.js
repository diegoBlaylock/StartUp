import { Page, Room } from "../models/models.js";
import { saveTable, getTable, Table, findByColumn } from "../database/database.js";
import { BadParameterError } from "./errors.js";
import { checkToken, findRoomByID, findUserByID, inflateWithOwner } from "./service-utils.js";

export function getRoomInfo(req) {
    checkToken(req.auth);
    const room = findRoomByID(req.roomID);
    return inflateWithOwner(room);
}

export async function createRoom(req) {
    const token = checkToken(req.auth);

    const room = new Room(
        token.userID,
        req.title,
        req.description,
    );

    const roomTable = getTable(Table.ROOM);
    roomTable.push(room);
    saveTable(Table.ROOM, roomTable);

    return room.roomID;
}

import * as fs from 'node:fs';
const PAGE_SIZE = 9;
export async function dicoverRooms(req) {
    checkToken(req.auth);

    let roomTable = [...getTable(Table.ROOM)];
    if(roomTable.length == 0){
        const data = fs.readFileSync("./public/js/mocks/init-rooms.json", 'utf-8');
        const res = JSON.parse(data);
        saveTable(Table.ROOM, res);
        roomTable = [...res];
    }

    const filterType = req.filterType;
    const filterVal = req.filterVal;
    const sortType = req.sortType;
    
    if (!Object.values(Filter).includes(filterType)) {
        throw new BadParameterError("Couldn't understand filterType " + filterType);
    }

    if (!Object.values(Sort).includes(sortType)) {
        throw new BadParameterError("Couldn't understand sortType " + sortType);
    }

    if(filterVal) {
        switch(filterType) {
            case Filter.USER:
                roomTable = roomTable.filter((room) => room.owner.username.toLowerCase().includes(room_request.search_param.toLowerCase()));
                break;
            case Filter.ROOM:
                roomTable = roomTable.filter((room) => room.title.toLowerCase().includes(room_request.search_param.toLowerCase()));
                break;
        }
    }

    switch(sortType) {
        case Sort.TIME_STAMP:
            roomTable.sort((a,b)=>b.timeStamp-a.timeStamp);
            break;
        case Sort.POPULARITY:
            roomTable;
            break;
    }

    let page = req.page ?? 0;
    const total = Math.ceil(roomTable.length / PAGE_SIZE);

    if(page !== 0 && page >= total) {
        page = total-1;
    }

    const rooms = roomTable.splice(PAGE_SIZE*page, PAGE_SIZE*page + PAGE_SIZE).map(inflateWithOwner);

    return new Page(rooms, page, total);
}

export async function getChatHistory(req) {
    checkToken(req.auth);

    const messageTable = [... getTable(Table.MESSAGE)];

    const threadID = req.threadID;
    messageTable.filter((v)=>v.threadID===threadID).sort((a,b)=>b.timeStamp-a.timeStamp);

    return messageTable.map(inflateWithOwner);
}

export const Sort = Object.freeze({
    POPULARITY: "popularity",
    TIME_STAMP: "timeStamp"
});

export const Filter = Object.freeze({
    USER: "user",
    ROOM: "room"
});