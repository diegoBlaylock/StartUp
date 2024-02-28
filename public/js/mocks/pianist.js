import {EventType, NoteEvent} from "/js/models/music.js"

export class Pianist {
    constructor(callback) {
        this.callback = callback;
        this.#start()
    }

    event(note, type) {
        return new NoteEvent(note, type);
    }

    rando(time, bob=1000) {
        return Math.random() * bob + time
    }

    run() {
        const note = Math.trunc(Math.random() * (84-36)) + 36;     
        this.callback(this.event(note, EventType.NOTE_ON));
        setTimeout(()=>this.callback(this.event(note, EventType.NOTE_OFF)), this.rando(1000))
        setTimeout(()=>this.run(), this.rando(400, 500));
    }

    async #start() {
        setTimeout(()=>this.run(), this.rando(800));
    }
}