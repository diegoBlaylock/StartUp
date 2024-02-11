
/**
 * Bridges the messages from 
 */
class MusicSocket {
    #socket;
    #noteEventCallback;
    #openCallback;
    #closeCallback;
    #errorCallback;
    
    constructor(socket) {
        this.#socket = socket;
        this.#noteEventCallback = null;
        this.#openCallback = null;
        this.#closeCallback = null;
        this.#errorCallback = null;
    }

    addNoteEventListener(callback) {

    }
}

class ChatSocket {

}