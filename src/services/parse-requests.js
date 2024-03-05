export function parseCreateUser(req) {
    return [true, req.body ?? {}]
}

export function parseLogin(req) {
    return [true, req.body ?? {}]
}

export function parseLogout(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    return [true, body]
}

export function parseEditUser(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    return [true, ]
}

export function parseGetRoom(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    body.req.params.roomID;
    return [true, body]
}

export function parseCreateRoom(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    return [true, body]
}

import { Filter, Search } from "./room-services";
export function parseDiscover(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    body.filterType = req.query.filterType ?? Search.ROOM;
    body.filterVal = req.query.filterVal ?? null;
    body.sortType = req.query.sortType ?? Filter.TIME_STAMP;
    return [true, body]
}

export function parseChatHistory(req) {
    const body = req.body ?? {};
    body.auth = getAuthToken(req);
    body.threadID = req.params.chatThreadID;
    return [true, body]
}


function getAuthToken(req) {
    return req.get("token");
}