import React, { useEffect, useState } from "react";

import {createNote, playNote, stopNote} from "../../utils/music.js"
import { EventType, NoteEvent } from "../../models/music.js";

function Scale({order, notesOn, noteCallback, playable}) {

    function play(note) {
        if(playable)
            noteCallback(new NoteEvent(note, EventType.NOTE_ON));
    }

    function stop(note) {
        if(playable)
            noteCallback(new NoteEvent(note, EventType.NOTE_OFF));
    }

    const notes = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'];
    const labels = ['c', 'c♯', 'd', 'd♯', 'e', 'f', 'f♯', 'g', 'g♯', 'a', 'a♯', 'b'];
    const start = (order+1) * 12;
    const strOrder = order.toString();

    useEffect(()=>{
        for(let i=0; i<12; i++) {
            createNote(start+i);
        }
    },[]);

    return (
        <div className={"scale-"+strOrder}>
            {notes.map(
                (note, i)=>{
                    const midiNote = start+i;
                    const backgroundColor = (notesOn[midiNote])? (note.includes('s')? "rgb(124, 124, 124)":"#c0c0c0") : null;
                    return <div 
                        data-midi={midiNote} 
                        key={midiNote} 
                        data-note={note+strOrder}
                        style={{backgroundColor:backgroundColor}}
                        onMouseDown={()=>play(midiNote)}
                        onTouchStart={()=>play(midiNote)}
                        onMouseEnter={(ev)=>{if(ev.buttons === 1 || ev.buttons === 3) play(midiNote)}}
                        onMouseUp={()=>stop(midiNote)}
                        onMouseLeave={()=>stop(midiNote)}
                        onTouchEnd={()=>stop(midiNote)}
                    >{labels[i]}{order}</div>
                }
            )}    
        </div>
    );
}

export default function Keyboard({playable=false, musicSocket}) {
    const [notesOn, updateNotesOn] = useState(()=>new Map()); 
    
    function onNoteEvent(noteEvent) {
        switch (noteEvent.event_type) {
            case EventType.NOTE_ON:
                playNote(noteEvent.note);
                break;
            case EventType.NOTE_OFF:
                stopNote(noteEvent.note);
                break;
        }
        musicSocket.sendNoteEvent(noteEvent);
        updateNotesOn(previous=>{
            const newMap = new Map(previous);
            newMap[noteEvent.note] = (noteEvent.event_type === EventType.NOTE_ON);
            return newMap;
        });
    }

    useEffect(()=>{
        if (!playable)
            musicSocket.addNoteEventListener((_, note) => onNoteEvent(note));
    }, []);

    return (
        <div className={"keyboard" + (playable?" playable":"")}>
            <div className="upper-keys keys-half">
                <Scale order={2} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} />
                <Scale order={3} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} />
            </div>
            <div className="lower-keys keys-half">
                <Scale order={4} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} />
                <Scale order={5} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} />
            </div>
        </div>
    );
}