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

}

export function removeWS(wsID) {
    
}