const ServerMessageType = Object.freeze({
    ERROR: 0,
    NOTE: 1,
    MESSAGE: 2,
    VIEWER_COUNT: 3    
});

const ClientMessageType = Object.freeze({ 
    JOIN_ROOM: 0,
    NOTE: 1,
    MESSAGE: 2
  });


/**
 * Wrapper around a websocket
 */
export class MusicSocket {
    #socket;
    #noteEventCallback;
    #errorCallback;
    
    constructor(socket) {
        this.#socket = socket;
        this.#noteEventCallback = null;
        this.#errorCallback = null;

        this.#socket.addEventListener("message", (event)=>this.#interceptMessage(event.data))
    }

    addNoteEventListener(callback) {
        this.#noteEventCallback = callback;
    }

    addOpenListener(callback) {
        this.#socket.addEventListener("open", (event) => callback(this, event));
    }

    addCloseListener(callback) {
        this.#socket.addEventListener("close", (event) => callback(this, event));
    }

    addErrorListener(callback) {
        this.#errorCallback = callback;
    }

    sendNoteEvent(noteEvent) {
        this.#socket.send(
            JSON.stringify(
                {
                    type: ClientMessageType.NOTE,
                    data: noteEvent 
                }
            )
        );
    }

    close(code, reason) {
        this.#socket.close(code, reason);
    }

    #interceptMessage(message) {
        const obj = JSON.parse(message);
        switch(obj.type) {
            case ServerMessageType.NOTE:
                if(this.#noteEventCallback)
                    this.#noteEventCallback(this, obj.data);
                break;
            case ServerMessageType.ERROR:
                if(this.#errorCallback)
                    this.#errorCallback(this, obj.data);
                break;
            default:
                if(this.#errorCallback)
                    this.#errorCallback(this, obj);
        }
    }
}

export class ChatSocket {
    #socket;
    #messageCallback;
    #viewerCountCallback;
    #errorCallback;
    
    constructor(socket) {
        this.#socket = socket;
        this.#messageCallback = null;
        this.#viewerCountCallback = null;
        this.#errorCallback = null;

        this.#socket.addEventListener("message", (event)=>this.#interceptMessage(event.data))
    }

    addMessageListener(callback) {
        this.#messageCallback = callback;
    }

    addViewerCountListener(callback) {
        this.#viewerCountCallback = callback;
    }

    addOpenListener(callback) {
        this.#socket.addEventListener("open", (event) => callback(this, event));
        if (this.#socket.readyState == WebSocket.OPEN ) callback(this);
    }

    addCloseListener(callback) {
        this.#socket.addEventListener("close", (event) => callback(this, event));
    }

    addErrorListener(callback) {
        this.#errorCallback = callback;
    }

    sendChatEvent(chatEvent) {
        this.#socket.send(
            JSON.stringify(
                {
                    type: ClientMessageType.MESSAGE,
                    data: chatEvent 
                }
            )
        );
    }

    sendJoinRoomEvent(roomID) {
        this.#socket.send(
            JSON.stringify(
                {
                    type: ClientMessageType.JOIN_ROOM,
                    data: {roomID: roomID} 
                }
            )
        );
    }

    close(code, reason) {
        this.#socket.close(code, reason);
    }

    #interceptMessage(message) {
        const obj = JSON.parse(message);
        switch(obj.type) {
            case ServerMessageType.MESSAGE:
                if(this.#messageCallback)
                    this.#messageCallback(this, obj.data);
                break;
            case ServerMessageType.VIEWER_COUNT:
                if(this.#viewerCountCallback)
                    this.#viewerCountCallback(this, obj.data);
                break;
            case ServerMessageType.ERROR:
                if(this.#errorCallback)
                    this.#errorCallback(this, obj.data);
                break;
            default:
                if(this.#errorCallback)
                    this.#errorCallback(this, obj.data);
        }
    }
}