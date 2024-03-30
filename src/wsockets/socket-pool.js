import { getAllRoomIDs } from "../database/database.js";
import { findRoomByID } from "../services/service-utils.js";

const idToWS = new Map();
const roomIDToWSIDs = new Map();

export function addRoom(roomID) {
    roomIDToWSIDs.set(roomID, new Set());
}

export function addWS(wsInfo) {
    const newID = crypto.randomUUID();
    wsInfo._id = newID;
    idToWS.set(newID, wsInfo);
    return newID;
}

export async function connectWSToRoom(wsID, roomID) {
    if (!idToWS.has(wsID)) return null;

    const wsInfo = idToWS.get(wsID);
    if (wsInfo.room != undefined) {
        roomIDToWSIDs.get(wsInfo.room)?.delete(wsInfo._id);
        wsInfo.player = false;
    }  
    wsInfo.room = roomID;
    const room = await findRoomByID(roomID);
    wsInfo.player = room.ownerID === wsInfo.token.userID;
    roomIDToWSIDs.get(roomID)?.add(wsID);
}

export function removeWS(wsID) {
    if (!idToWS.has(wsID)) return null;

    const wsInfo = idToWS.get(wsID);
    if (wsInfo.room != undefined) {
        roomIDToWSIDs.get(wsInfo.room)?.delete(wsInfo._id);
        wsInfo.player = false;
    }

    idToWS.delete(wsID);
}

export function removeRoom(roomID) {
    const wsIDs = roomIDToWSIDs.get(roomID) ?? [];
    wsIDs.forEach(id => removeWS(id));
}

export function broadcast(roomID, data, wsID=null) {
    const wsIDs = roomIDToWSIDs.get(roomID) ?? [];
    wsIDs.forEach(id=>{
        if(id === wsID) return;
        const wsInfo = idToWS.get(id);
        if(wsInfo == null || wsInfo.ws == null) wsIDs.delete(id);
        else wsInfo.ws.send(JSON.stringify(data));
    });
}

export function getConnections() {
    return idToWS.values();
}

export function isRoomIDActive(roomID) {
    return roomIDToWSIDs.has(roomID);
}

export function getRoomCount(roomID) {
    return roomIDToWSIDs.get(roomID)?.size ?? 0;
}

(await getAllRoomIDs()).forEach(room=>addRoom(room._id));