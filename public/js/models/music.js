export const EventType = Object.freeze({
    NOTE_OFF: Symbol(0),
    NOTE_ON: Symbol(1)
});

export const Intrument = Object.freeze({
    PIANO: 1,
    ORGAN: 20,
    GUITAR: 26
});


export class NoteEvent {
    note;
    instrument;
    velocity;
    event_type;
}
