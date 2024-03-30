import { addMessage } from "../database/database.js";
import { Message } from "../models/models.js";
import { UnauthorizedError, NotInRoomError } from "../services/errors.js";
import { findToken, inflateWithOwner } from "../services/service-utils.js";
import { isRoomIDActive, connectWSToRoom, broadcast, getRoomCount } from "./socket-pool.js";

export const ReceiveEventType = Object.freeze({
  JOIN_ROOM: 0,
  NOTE: 1,
  MESSAGE: 2
});

export const SendMessageType = Object.freeze({
  ERROR: 0,
  NOTE: 1,
  MESSAGE: 2,
  VIEWER_COUNT: 3
});

async function onJoinRoomEvent(connection, data) {
    if(data.roomID == null || !isRoomIDActive(data.roomID)) throw new NotInRoomError();
    connectWSToRoom(connection._id, data.roomID);
    const count = getRoomCount(data.roomID);
    broadcast(connection.room, buildResponse(SendMessageType.VIEWER_COUNT, {count: count}));
}
  
async function onNoteEvent(connection, data) {
    broadcast(connection.room, buildResponse(SendMessageType.NOTE, data)); // connection._id);
}

async function onChatEvent(connection, data) {
    const message = data.message;
    const token = connection.token;
    const roomID = connection.room;
    if(token == null) throw new UnauthorizedError();
    if(roomID == null || !isRoomIDActive(roomID)) throw new NotInRoomError();

    const obj = new Message(token.userID, message, roomID);
    await addMessage(obj);
    const inflated = await inflateWithOwner(obj);
    delete inflated.ownerID;
    delete inflated.owner._id;
    broadcast(connection.room, buildResponse(SendMessageType.MESSAGE, inflated)) // connection._id);
}

export default {
    onJoinRoomEvent: onJoinRoomEvent,
    onNoteEvent: onNoteEvent,
    onChatEvent: onChatEvent
}

function buildResponse(type, data) {
    return {type: type, data:data};
}