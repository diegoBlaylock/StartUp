
/*
  Chat Methods

  Client -> Server

    Auth?
    Write Message

  server -> Client

    Notification
    Message
    
*/

const EVENT_TYPE = Object.freeze({ 
  AUTHORIZE
});

import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ noServer: true });

export function setupWebsockets(server) {
  server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });
}


wss.on("connection", (ws)=> {

});