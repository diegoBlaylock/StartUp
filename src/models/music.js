export const EventType = Object.freeze({
    NOTE_OFF: 0,
    NOTE_ON: 1,
    SUSTAIN_ON: 2,
    SUSTAIN_OFF: 3,
});


export class NoteEvent {
    note;
    event_type;

    constructor(note, type) {
        this.note = note;
        this.event_type = type;
    }
}
