import { ChatSocket, MusicSocket } from "../../endpoints/websockets.js"
import { openWebsocket } from "../../endpoints/api.js"

const socket = openWebsocket();
export const chatSocket = new ChatSocket(socket);
export const musicSocket = new MusicSocket(socket);

export function onLoad(messageHandler, viewCountHandler, noteHandler, errorHandler) {
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('roomID');

    chatSocket.addOpenListener(()=>chatSocket.sendJoinRoomEvent(roomID));
    chatSocket.addMessageListener((_, message) => messageHandler(message));
    chatSocket.addViewerCountListener((_, newCount) => viewCountHandler(newCount));
    chatSocket.addErrorListener((_, error) => errorHandler(error));
    musicSocket.addNoteEventListener((_, note) => noteHandler(note));
}