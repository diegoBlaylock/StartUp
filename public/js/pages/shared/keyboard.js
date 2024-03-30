import {createNote, playNote, stopNote} from "/js/music.js"
import { EventType, NoteEvent } from "/js/models/music.js";

const noteElementMap = new Map();

function getNote(element) {
    return parseInt(element.dataset.midi);
}

function getElement(note) {
    return noteElementMap.get(note);
}

function displayNoteOn(note) {
    const element = getElement(note);

    if(element.dataset.note.includes("s"))
        element.style.backgroundColor = "rgb(124, 124, 124)";
    else
        element.style.backgroundColor = "#c0c0c0";
}

function displayNoteOff(note) {
    const element = getElement(note);
    element.style.backgroundColor = null;
}

export function noteOn(note) {
    playNote(note);
    displayNoteOn(note);
}

export function noteOff(note) {
    stopNote(note);
    displayNoteOff(note);
}

function setupInteraction(el, noteCallback) {
    const note = getNote(el);
    const playNote = ()=>noteCallback(new NoteEvent(note, EventType.NOTE_ON));
    const stopNote = ()=>noteCallback(new NoteEvent(note, EventType.NOTE_OFF));

    el.addEventListener("mousedown", playNote);
    el.addEventListener("touchstart", playNote);
    el.addEventListener("mouseenter", (ev)=>{
        if(ev.buttons === 1 || ev.buttons === 3) playNote();
    });
    el.addEventListener("mouseleave", stopNote);
    el.addEventListener("mouseup", stopNote);
    el.addEventListener("touchend", stopNote);
}

export function setupKeyboard(playable=false, noteCallback) {
    document.querySelectorAll("div[data-note]").forEach(el=>{    
        const note = getNote(el);
        createNote(note);
        noteElementMap.set(note, el);
        if(playable)
            setupInteraction(el, noteCallback);
    });
}