import {
    createUser,
    loginUser,
    logoutUser,
    editUser
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

    pluginService(post, '/users/create/', parseCreateUser, createUser, 201);
    pluginService(post, '/users/login/', parseLogin, loginUser, 201);
    pluginService(dlt, '/users/logout/', parseLogout, logoutUser, 204);
    pluginService(put, '/users/edit/', parseEditUser, editUser);
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
            res.send(serviceResponse)
    }
) {
    method(path, (req, res)=>{
        const [valid, serviceRequest] = requestParser(req, res);
        if (valid) {
            const serviceResponse = service(serviceRequest);
            res.status(status);
            respond(res, serviceResponse);
        }
    });
}   