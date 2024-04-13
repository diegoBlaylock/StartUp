export const EventType = Object.freeze({
    NOTE_OFF: 0,
    NOTE_ON: 1,
    SUSTAIN: 2,
    SHIFT_TOP_SCALE: 3,
    SHIFT_BOTTOM_SCALES: 4
});


export class NoteEvent {
    note;
    event_type;

    constructor(note, type) {
        this.note = note;
        this.event_type = type;
    }
}
