
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
import { addWS } from './socket-pool';

const wss = new WebSocketServer({ noServer: true });

const EVENT_TYPE = Object.freeze({ 
  AUTHORIZE: "authorize",

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

  const wsID = addWS(connection);

  ws.on('message', function message(data) {
    connections.forEach((c) => {
      if (c.id !== connection.id) {
        c.ws.send(data);
      }
    });
  });

  // Remove the closed connection so we don't try to forward anymore
  ws.on('close', () => {
    connections.findIndex((o, i) => {
      if (o.id === connection.id) {
        connections.splice(i, 1);
        return true;
      }
    });
  });

  ws.on('pong', () => {
    connection.alive = true;
  });

});


setInterval(() => {
  connections.forEach((c) => {
    // Kill any connection that didn't respond to the ping last time
    if (!c.alive) {
      c.ws.terminate();
    } else {
      c.alive = false;
      c.ws.ping();
    }
  });
}, 10000);