
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
    ws: ws,
    room: null
  }


});