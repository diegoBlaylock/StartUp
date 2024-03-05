/*
pluginService(app.post, '/users/create/', parseCreateUser, createUser, 201);
    pluginService(app.post, '/users/login/', parseLogin, loginUser, 201);
    pluginService(app.delete, '/users/logout/', parseLogout, logoutUser, 204);
    pluginService(app.put, '/users/edit/', parseEditUser, editUser);
    pluginService(app.get, '/rooms/:roomID/', parseGetRoom, getRoomInfo);
    pluginService(app.post, '/rooms/create/', parseCreateRoom, createRoom, 201);
    pluginService(app.get, '/rooms/discover/', parseDiscover, dicoverRooms);
    pluginService(app.get, '/chat/:chatThreadID/', parseChatHistory, getChatHistory);
*/


export function parseCreateUser(req, res) {
    const httpRequest = req.body();
    console.log();
    return [true, ]
}

export function parseLogin(req, res) {
    return [true, ]
}

export function parseLogout(req, res) {
    return [true, ]
}

export function parseEditUser(req, res) {
    return [true, ]
}

export function parseGetRoom(req, res) {
    const roomID = req.params.roomID;
    return [true, {hello: roomID}]
}

export function parseCreateRoom(req, res) {
    return [true, ]
}

export function parseDiscover(req, res) {
    return [true, ]
}

export function parseChatHistory(req, res) {
    return [true, ]
}