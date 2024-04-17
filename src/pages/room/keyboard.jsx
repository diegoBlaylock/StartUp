import React, { useEffect, useRef, useState, useContext } from "react";

import { MAX_VOLUME } from "../../utils/music"
import { EventType, NoteEvent } from "../../models/music.js";
import './keyboard.css'
import Layout from './keyboard-layout.json'
import { AudioPlayerContext } from "../../app.jsx";

export default function Keyboard({playable=false, musicSocket, wsReady}) {
    const notesOn = useRef(new Map()); 
    const elementMap = useRef(new Map());
    const audioPlayer = useContext(AudioPlayerContext);
    const [sustain, setSustain] = useState(false);
    const [volume, setVolume] = useState(50);
    const [topScale, _setTopScale] = useState(Layout['top-scale']);
    const [bottomScale, _setBottomScale] = useState(Layout['bottom-scale']);

    function onNoteEvent(noteEvent) {
        if(!wsReady) return;

        let notePlayed = false;
        switch (noteEvent.event_type) {
            case EventType.NOTE_ON:
                audioPlayer.current.playNote(noteEvent.note);
                document.getElementById(elementMap.current.get(noteEvent.note))?.classList.add("on");
                notePlayed = true;
                break;
            case EventType.NOTE_OFF:
                audioPlayer.current.stopNote(noteEvent.note);
                document.getElementById(elementMap.current.get(noteEvent.note))?.classList.remove("on");
                notePlayed = true;
                break;
            case EventType.SUSTAIN:
                setSustain((noteEvent.note)? true:false);
        }

        if(playable)
            musicSocket.current.sendNoteEvent(noteEvent);

        if (notePlayed)
            notesOn.current.set(noteEvent.note, (noteEvent.event_type === EventType.NOTE_ON));
    }

    function play(note) {
        if(playable && !notesOn.current.get(note))
            onNoteEvent(new NoteEvent(note, EventType.NOTE_ON));
    }

    function stop(note) {
        if(playable && notesOn.current.get(note))
            onNoteEvent(new NoteEvent(note, EventType.NOTE_OFF));
    }

    const changeSustain = (value) => {
        if(playable)
            onNoteEvent(new NoteEvent(value, EventType.SUSTAIN));
    }

    useEffect(()=>{
        return ()=>{
            audioPlayer.current.sustain(false);
            for (const [note, on] of notesOn.current) {
                if(on) stop(note);
            }
            changeSustain(false);
        };
    }, []);

    useEffect(()=>{
        if (wsReady && !playable)
            musicSocket.current.addNoteEventListener((_, note) => onNoteEvent(note));
    }, [wsReady]);

    useEffect(()=>audioPlayer.current.sustain(sustain), [sustain]);

    useEffect(()=>audioPlayer.current.setVolume(volume/100*MAX_VOLUME), [volume])

    const keyComponent = playable? <Tastatur selector="#room_main_content" play={note=>play(note)} stop={note=>stop(note)} sustain={val=>changeSustain(val)} /> : (null);

    return (
        <>
            <div className={"keyboard" + (playable?" playable":"")}>
                {keyComponent}
                <div className="upper-keys keys-half">
                    <Scale order={topScale} elementMap={elementMap.current} play={note=>play(note)} stop={note=>stop(note)} />
                    <Scale order={topScale+1} elementMap={elementMap.current} play={note=>play(note)} stop={note=>stop(note)} />
                </div>
                <div className="lower-keys keys-half">
                    <Scale order={bottomScale} elementMap={elementMap.current} play={note=>play(note)} stop={note=>stop(note)} />
                    <Scale order={bottomScale+1} elementMap={elementMap.current} play={note=>play(note)} stop={note=>stop(note)} />
                </div>
            </div>
            <div id="controls">
                <div className="control-input">
                    <label htmlFor="volume">Volume:</label>
                    <input type="range" id="volume" name="volume" tabIndex={-1} min={0} max={100} value={volume} onChange={ev=>setVolume(ev.target.value)} />
                </div>
                <div className="control-input">
                    <label htmlFor="sustain">Sustain:</label>
                    <input type="checkbox" id="sustain" name="sustain" checked={sustain} disabled={!playable} tabIndex={-1} onChange={ev=>changeSustain(ev.target.checked)}/>
                </div>
            </div>
        </>
    );
}

export function Tastatur({selector, play, stop, sustain}) {
    useEffect(()=>{
        const component = document.querySelector(selector);

        const keysToNote = new Map();

        const topScale = 12 * (Layout['top-scale']+1);
        const bottomScale = 12*(Layout['bottom-scale']+1);
        
        Layout['top-keys'].forEach((val, i)=>keysToNote.set(val, topScale+i));
        Layout['bottom-keys'].forEach((val, i)=>keysToNote.set(val, bottomScale+i));

        component.addEventListener('keyup', (event)=> {
            event.preventDefault();
            if(event?.repeat) return
            if(keysToNote.has(event.keyCode)) {
                const note = keysToNote.get(event.keyCode);
                stop(note);
            } else if(event.key === " ") {
                sustain(false);
            }
        });

        component.addEventListener('keydown', (event)=>{
            event.preventDefault();
            if(event?.repeat) return;
            if(keysToNote.has(event.keyCode)) {
                const note = keysToNote.get(event.keyCode);
                play(note);
            } else if(event.key === " ") {
                sustain(true);
            }
        });
        
    }, []);
}

function Scale({order, elementMap, play, stop}) {
    const notes = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'];
    const labels = ['c', 'c♯', 'd', 'd♯', 'e', 'f', 'f♯', 'g', 'g♯', 'a', 'a♯', 'b'];
    const start = (order+1) * 12;
    const strOrder = order.toString();

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
                        onMouseDown={(ev)=>{if(ev.buttons === 1 || ev.buttons === 3) {play(midiNote);} }}
                        onTouchStart={()=>play(midiNote)}
                        onMouseEnter={(ev)=>{if(ev.buttons === 1 || ev.buttons === 3) {play(midiNote);} }}
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