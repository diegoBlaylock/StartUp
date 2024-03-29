import {
    createUser,
    loginUser,
    logoutUser,
    editUser,
    getUser,
    validateToken
} from './services/user-services.js';

import {
    getRoomInfo,
    createRoom,
    dicoverRooms,
    getChatHistory
} from './services/room-services.js';

import {
    parseCreateUser, 
    parseLogin, 
    parseLogout, 
    parseEditUser, 
    parseGetUser,
    parseGetRoom, 
    parseCreateRoom, 
    parseDiscover, 
    parseChatHistory,
    parseValidateUser
} from './services/parse-requests.js';

import { setupWebsockets } from './wsockets/websocket.js';

import express from 'express';
const app = express();

setupExpress();
setupRoutes();
const server = app.listen(4000);
setupWebsockets(server);


function setupExpress() {
    app.use(express.static('public'));
    app.use(express.json());
}

function setupRoutes() {
    const get = app.get.bind(app);
    const post = app.post.bind(app);
    const dlt = app.delete.bind(app);
    const patch = app.patch.bind(app);

    app.get('/', (_req, res)=>res.sendFile("public/html/discovery.html"));
    pluginService(post, '/users/create/', parseCreateUser, createUser, 201);
    pluginService(post, '/users/login/', parseLogin, loginUser, 201);
    pluginService(dlt, '/users/logout/', parseLogout, logoutUser, 204);
    pluginService(patch, '/users/edit/', parseEditUser, editUser);
    pluginService(get, '/users/:userID/', parseGetUser, getUser);
    pluginService(get, '/token/validate/', parseValidateUser, validateToken);
    pluginService(get, '/rooms/discover/', parseDiscover, dicoverRooms);
    pluginService(get, '/rooms/:roomID/', parseGetRoom, getRoomInfo);
    pluginService(post, '/rooms/create/', parseCreateRoom, createRoom, 201);
    pluginService(get, '/chat/:chatThreadID/', parseChatHistory, getChatHistory);
}


function pluginService(
    method, 
    path, 
    requestParser, 
    service, 
    status=200,
    respond=(res, serviceResponse)=>{
        if(serviceResponse !== undefined)
            res.json(serviceResponse);
        else
            res.send();
    }
) {
    method(path, async (req, res)=>{
        try {
            const serviceRequest = requestParser(req);
            const serviceResponse = await service(serviceRequest);
            res.status(status);
            respond(res, serviceResponse);
        } catch(e) {
            handleError(e, res);
        }
    });
}   


import { ValueTakenError, MissingParameterError, BadParameterError, UnauthorizedError, ResourceNotFoundError} from './services/errors.js'
function handleError(err, res) {
    switch (true) {
        case err instanceof ValueTakenError:
        case err instanceof MissingParameterError:
        case err instanceof BadParameterError:
            res.status(400);
            res.json({error: err.message});
            break;
        case err instanceof UnauthorizedError:
            res
            .status(401)
            .json({redirect: '/', error: "Not loggedin!"});
            break;
        case err instanceof ResourceNotFoundError:
            res.status(404);
            res.json({error: err.message});
            break;
        default:
            res.status(500);
            res.json({error: err.toString()})
          // throw err;
    }
}