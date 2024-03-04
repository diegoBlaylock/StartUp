const express = require('express');
const app = express();

setupExpress();
setupRoutes();
app.listen(8080);


function setupExpress() {
    app.use(express.static('public'));
}

function pluginService(
    method, 
    path, 
    validation, 
    service, 
    status=200,
    respond=(res, serviceResponse)=>{
        if(serviceResponse !== undefined)
            res.send(serviceResponse)
    }
) {
    method(path, (req, res)=>{
        const [valid, serviceRequest] = validation(req, res);
        if (valid) {
            const serviceResponse = service(serviceRequest);
            res.status(status);
            respond(res, serviceResponse);
        }
    });
}   

import {createUser} from './services/user-services';
import { validateCreateUser as parseCreateUser } from './services/validate-requests';

function setupRoutes() {
    pluginService(app.post, '/users/create/', parseCreateUser, createUser, 201);
    pluginService(app.post, '/users/login/', parseLogin, loginUser, 201);
    pluginService(app.delete, '/users/logout/', parseLogout, logoutUser, 204);
    pluginService(app.put, '/users/edit/', parseEditUser, editUser);
    pluginService(app.get, '/rooms/:roomID/', parseGetRoom, getRoomInfo);
    pluginService(app.post, '/rooms/create/', parseCreateRoom, createRoom, 201);
    pluginService(app.get, '/rooms/:roomID/', parseGetRoom, getRoomInfo);
    pluginService(app.get, '/rooms/discover/', parseDiscover, dicoverRooms)
}

