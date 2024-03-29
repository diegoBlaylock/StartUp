const idToWS = new Map();
const roomIDToWSIDs = new Map();


export function addRoom(roomID) {
    roomIDToWSIDs.set(roomID, new Set());
}

export function addWS(wsInfo) {
    const newID = crypto.randomUUID();
    wsInfo._id = newID;
    idToWS.set(newID, wsInfo);
    return newID;
}

export function connectWSToRoom(wsID, roomID) {
    if (!idToWS.has(wsID)) return null;

    const wsInfo = idToWS.get(wsID);
    if (wsInfo.room != undefined) {
        roomIDToWSIDs.get(wsInfo.room)?.delete(wsInfo._id);
    }  
    wsInfo.room = roomID;

    roomIDToWSIDs.get(roomID)?.add(wsID);
}

export function removeWS(wsID) {
    if (!idToWS.has(wsID)) return null;

    const wsInfo = idToWS.get(wsID);
    if (wsInfo.room != undefined) {
        roomIDToWSIDs.get(wsInfo.room)?.delete(wsInfo._id);
    }

    idToWS.delete(wsID);
}

export function removeRoom(roomID) {
    const wsIDs = roomIDToWSIDs.get(roomID) ?? [];
    wsIDs.forEach(id => removeWS(id));
}

export function broadcast(roomID, data, wsID=null) {
    const wsIDs = roomIDToWSIDs.get(roomID) ?? [];
    wsIDs.forEach((id)=>{
        if(id === wsID) return;
        const wsInfo = idToWS.get(id);
        if(wsInfo == null) wsIDs.delete(id);
        wsInfo.ws.send(JSON.stringify(data));
    });
}

export function getConnections() {
    return idToWS.values();
}