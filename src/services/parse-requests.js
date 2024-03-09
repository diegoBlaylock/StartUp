export function parseCreateUser(req) {
    return req.body ?? {}
}

export function parseLogin(req) {
    return req.body ?? {}
}

export function parseLogout(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    return body
}

export function parseEditUser(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    return body;
}

export function parseGetRoom(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    body.roomID = req.params.roomID;
    return body
}

export function parseCreateRoom(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    return body
}

import { Filter, Search } from "./room-services.js";
export function parseDiscover(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    body.filterType = req.query.filterType ?? Search.ROOM;
    body.filterVal = req.query.filterVal ?? null;
    body.sortType = req.query.sortType ?? Filter.TIME_STAMP;
    return body
}

export function parseChatHistory(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    body.threadID = req.params.chatThreadID;
    return body
}


function getAuthToken(req) {
    return req.get("token");
}