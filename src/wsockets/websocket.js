
/*
  Chat Methods

  Client -> Server

    Auth?
    Write Message

  server -> Client

    Notification
    Message
    
*/

import { WebSocketServer } from 'ws';
import { checkToken, findToken } from '../services/service-utils';
import { addWS, broadcast, connectWSToRoom, removeWS } from './socket-pool';

const wss = new WebSocketServer({ noServer: true });

const ReceiveEventType = Object.freeze({ 
  JOIN_ROOM: 0,
  NOTE: 1,
  MESSAGE: 2
});

const SendMessageType = Object.freeze({
  ERROR: 0,
  NOTE: 1,
  MESSAGE: 2,
  VIEWER_COUNT: 3    
});

export function setupWebsockets(server) {
  
  server.on('upgrade', async (request, socket, head) => {
    const token = request.headers.token;
    await checkToken(token);
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });
}

wss.on("connection", async (ws, request)=>{
  const token = await findToken(request.headers.token);
  
  const connection = {
    token: token,
    alive: true,
    ws: ws,
    room: null
  }
  
  addWS(connection);

  ws.on('message', (data) => onMessage(connection, data));
  ws.on('close', () => onClose(connection));
  ws.on('pong', () => onPong(connection));

});

function onMessage(connection, message) {
  
  function onJoinRoomEvent(data) {
    connectWSToRoom(connection._id, data.roomID);
  }
  
  function onNoteEvent(data) {
    broadcast(connect.room, data,) // connection._id);
  }

  function onChatEvent(data) {
    broadcast(connect.room, data,) // connection._id);
  }

  const json = JSON.parse(message);
  switch(json.type) {
    case ReceiveEventType.JOIN_ROOM:
      onJoinRoomEvent(json);
      break;
    case ReceiveEventType.MESSAGE:
      onChatEvent(json);
      break;
    case ReceiveEventType.NOTE:
      onNoteEvent(json);
      break;
  }
}

function onClose(connection) {
  removeWS(connection._id);
}

function onPong(connection) {
  connection.alive = true;
}

setInterval(() => {
  connections.forEach((c) => {
    if (!c.alive) {
      c.ws.terminate();
    } else {
      c.alive = false;
      c.ws.ping();
    }
  });
}, 10000);