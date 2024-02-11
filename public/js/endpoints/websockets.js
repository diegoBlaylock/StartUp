const MessageType = Object.freeze({
    ERROR: 0,
    NOTE_EVENT: 1,
    MESSAGE_EVENT: 2,
    VIEWER_COUNT_EVENT: 3    
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
        this.#socket.send(JSON.stringify(noteEvent));
    }

    close(code, reason) {
        this.#socket.close(code, reason);
    }

    #interceptMessage(message) {
        const obj = JSON.parse(message);
        switch(obj.type) {
            case MessageType.NOTE_EVENT:
                this.#noteEventCallback(this, obj.data);
                break;
            case MessageType.ERROR:
                this.#errorCallback(this, obj.data);
                break;
            default:
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
    }

    addCloseListener(callback) {
        this.#socket.addEventListener("close", (event) => callback(this, event));
    }

    addErrorListener(callback) {
        this.#errorCallback = callback;
    }

    sendNoteEvent(noteEvent) {
        this.#socket.send(JSON.stringify(noteEvent));
    }

    close(code, reason) {
        this.#socket.close(code, reason);
    }

    #interceptMessage(message) {
        const obj = JSON.parse(message);
        switch(obj.type) {
            case MessageType.MESSAGE_EVENT:
                this.#messageCallback(this, obj.data);
                break;
            case MessageType.VIEWER_COUNT_EVENT:
                this.#viewerCountCallback(this, obj.data);
                break;
            case MessageType.ERROR:
                this.#errorCallback(this, obj.data);
                break;
            default:
                this.#errorCallback(this, obj);
        }
    }
}