import React, { useEffect, useRef, useState } from "react";

import AudioPlayer from "../../utils/music"
import { EventType, NoteEvent } from "../../models/music.js";

export default function Keyboard({playable=false, musicSocket}) {
    const notesOn = useRef(new Map()); 
    const elementMap = useRef(new Map());
    const audioPlayer = useRef(new AudioPlayer());
    const [sustain, setSustain] = useState(false);

    function onNoteEvent(noteEvent) {
        switch (noteEvent.event_type) {
            case EventType.NOTE_ON:
                audioPlayer.current.playNote(noteEvent.note);
                document.getElementById(elementMap.current.get(noteEvent.note))?.classList.add("on");
                break;
            case EventType.NOTE_OFF:
                audioPlayer.current.stopNote(noteEvent.note);
                document.getElementById(elementMap.current.get(noteEvent.note))?.classList.remove("on");
                break;
        }
        musicSocket.current.sendNoteEvent(noteEvent);
        notesOn.current.set(noteEvent.note, (noteEvent.event_type === EventType.NOTE_ON));

    }

    useEffect(()=>{
        async function loadAudioPlayer() {
            const availableNotes = [36, 43, 48, 55, 60, 67, 72, 79, 84];
            availableNotes.forEach(async (note)=>{
                const mp3 = await fetch(`/resources/notes/${note}.mp3`);
                const buffer = await mp3.arrayBuffer();
                await audioPlayer.current.seed(note, buffer);
            });
        }
        loadAudioPlayer();
        if (!playable)
            musicSocket.current.addNoteEventListener((_, note) => onNoteEvent(note));
    }, []);

    useEffect(()=>{
        audioPlayer.current.sustain(sustain);
    }, [sustain]);

    const keyComponent = playable? <Tastatur selector="#room_main_content" onNoteEvent={(ev)=>onNoteEvent(ev)} notesOn={notesOn} setSustain={setSustain} /> : (null);

    return (
        <div className={"keyboard" + (playable?" playable":"")}>
            {keyComponent}
            <div className="upper-keys keys-half">
                <Scale order={2} notesOn={notesOn} elementMap={elementMap.current} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
                <Scale order={3} notesOn={notesOn} elementMap={elementMap.current} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
            </div>
            <div className="lower-keys keys-half">
                <Scale order={4} notesOn={notesOn} elementMap={elementMap.current} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
                <Scale order={5} notesOn={notesOn} elementMap={elementMap.current} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
            </div>
        </div>
    );
}

export function Tastatur({selector, onNoteEvent, notesOn, setSustain}) {
    useEffect(()=>{
        const component = document.querySelector(selector);
        const keys= ["Tab", "1", "q", "2", "w", "e", "4", "r", "5", "t", "6", "y", "u", "8", "i","9","o","p","a","z","s","x","d","c","v","g","b","h","n","m","k",",","l",".",";","/"];
        const keysToNote = new Map(keys.map((val, i)=>[val, i+36]));

        component.addEventListener('keyup', (event)=> {
            event.preventDefault();
            if(event?.repeat) return
            if(keysToNote.has(event.key)) {
                onNoteEvent(new NoteEvent(keysToNote.get(event.key), EventType.NOTE_OFF));
            }

            if(event.key === " ") {
                setSustain(false);
            }
        });
        component.addEventListener('keydown', (event)=>{
            event.preventDefault();
            if(event?.repeat) return;
            if(keysToNote.has(event.key) && (!notesOn.current.get(keysToNote.get(event.key)))) {
                onNoteEvent(new NoteEvent(keysToNote.get(event.key), EventType.NOTE_ON));
            }

            if(event.key === " ") {
                setSustain(true);
            }
        });
        
    }, []);
}

function Scale({order, notesOn, elementMap, noteCallback, playable, audioPlayer}) {

    function play(note) {
        if(playable)
            noteCallback(new NoteEvent(note, EventType.NOTE_ON));
    }

    function stop(note) {
        if(playable && notesOn.current.get(note))
            noteCallback(new NoteEvent(note, EventType.NOTE_OFF));
    }

    const notes = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'];
    const labels = ['c', 'c♯', 'd', 'd♯', 'e', 'f', 'f♯', 'g', 'g♯', 'a', 'a♯', 'b'];
    const start = (order+1) * 12;
    const strOrder = order.toString();

    useEffect(()=>{
        return ()=>audioPlayer?.current?.destroy();
    },[]);

    return (
        <div className={"scale-"+strOrder}>
            {notes.map(
                (note, i)=>{
                    const midiNote = start+i;
                    const id = `key${midiNote}`;
                    const div = <div 
                        id={id}
                        data-midi={midiNote} 
                        key={midiNote} 
                        data-note={note+strOrder}
                        onMouseDown={(ev)=>{if(ev.buttons === 1 || ev.buttons === 3) play(midiNote)}}
                        onTouchStart={()=>play(midiNote)}
                        onMouseEnter={(ev)=>{if(ev.buttons === 1 || ev.buttons === 3) play(midiNote)}}
                        onMouseUp={()=>stop(midiNote)}
                        onMouseLeave={()=>stop(midiNote)}
                        onTouchEnd={()=>stop(midiNote)}
                    >{labels[i]}{order}</div>
                    elementMap.set(midiNote, id);
                    return div;
                }
            )}    
        </div>
    );
}