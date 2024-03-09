import {
    createUser,
    loginUser,
    logoutUser,
    editUser,
    getUser
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
    parseChatHistory
} from './services/parse-requests.js';

import express from 'express';
const app = express();

setupExpress();
setupRoutes();
app.listen(5500);


function setupExpress() {
    app.use(express.static('public'));
    app.use(express.json());
}

function setupRoutes() {
    const get = app.get.bind(app);
    const post = app.post.bind(app);
    const dlt = app.delete.bind(app);
    const put = app.put.bind(app);

    app.get('/', (req, res)=>res.sendFile("public/html/discovery.html"));
    pluginService(post, '/users/create/', parseCreateUser, createUser, 201);
    pluginService(post, '/users/login/', parseLogin, loginUser, 201);
    pluginService(dlt, '/users/logout/', parseLogout, logoutUser, 204);
    pluginService(put, '/users/edit/', parseEditUser, editUser, 204);
    pluginService(get, '/users/:userID/', parseGetUser, getUser)
    pluginService(get, '/rooms/:roomID/', parseGetRoom, getRoomInfo);
    pluginService(post, '/rooms/create/', parseCreateRoom, createRoom, 201);
    pluginService(get, '/rooms/discover/', parseDiscover, dicoverRooms);
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
            res.json(serviceResponse)
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


import { ValueTakenError, MissingParameterError, BadParameterError, UnauthorizedError} from './services/errors.js'
function handleError(err, res) {
    switch (true) {
        case err instanceof ValueTakenError:
        case err instanceof MissingParameterError:
        case err instanceof BadParameterError:
            res.status(400);
            res.json({error: err.message});
            break;
        case err instanceof UnauthorizedError:
            res.redirect(401, '/');
            break;
        default:
            res.status(500);
            res.json({error: err.toString()})
            throw err;
    }
}