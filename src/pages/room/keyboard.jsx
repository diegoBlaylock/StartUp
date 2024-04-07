import React, { useEffect, useRef, useState } from "react";

import AudioPlayer from "../../utils/music"
import { EventType, NoteEvent } from "../../models/music.js";

function Scale({order, notesOn, noteCallback, playable, audioPlayer}) {

    function play(note) {
        if(playable)
            noteCallback(new NoteEvent(note, EventType.NOTE_ON));
    }

    function stop(note) {
        if(playable && notesOn[note])
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
    const audioPlayer = useRef(new AudioPlayer());

    function onNoteEvent(noteEvent) {
        switch (noteEvent.event_type) {
            case EventType.NOTE_ON:
                audioPlayer.current.playNote(noteEvent.note);
                break;
            case EventType.NOTE_OFF:
                audioPlayer.current.stopNote(noteEvent.note);
                break;
        }
        musicSocket.current.sendNoteEvent(noteEvent);
        updateNotesOn(previous=>{
            const newMap = new Map(previous);
            newMap[noteEvent.note] = (noteEvent.event_type === EventType.NOTE_ON);
            return newMap;
        });
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

    return (
        <div className={"keyboard" + (playable?" playable":"")}>
            <div className="upper-keys keys-half">
                <Scale order={2} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
                <Scale order={3} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
            </div>
            <div className="lower-keys keys-half">
                <Scale order={4} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
                <Scale order={5} notesOn={notesOn} noteCallback={(ev)=>onNoteEvent(ev)} playable={playable} audioPlayer={audioPlayer}/>
            </div>
        </div>
    );
}