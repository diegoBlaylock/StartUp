import { findToken } from "../services/service-utils";

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

function onJoinRoomEvent(connection, data) {
    connectWSToRoom(connection._id, data.roomID);
}
  
function onNoteEvent(connection, data) {
    broadcast(connection.room, data,) // connection._id);
}

function onChatEvent(connection, data) {
    const message = data.message;
    const token = findToken(connection.token);
    broadcast(connection.room, data,) // connection._id);
}

export default {
    onJoinRoomEvent: onJoinRoomEvent,
    onNoteEvent: onNoteEvent,
    onChatEvent: onChatEvent
}

function buildResponse(type, data) {
    return {type: type, data:data};
}