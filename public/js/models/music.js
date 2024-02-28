export const EventType = Object.freeze({
    NOTE_OFF: 0,
    NOTE_ON: 1
});


export class NoteEvent {
    note;
    event_type;

    constructor(note, type) {
        this.note = note;
        this.event_type = type;
    }
}
