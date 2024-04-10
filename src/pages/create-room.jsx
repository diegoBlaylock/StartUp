import React, { useEffect, useState } from "react"

import { NavLink, useNavigate } from "react-router-dom";
import {createRoom} from "../endpoints/api.js"
import {CreateRoomRequest} from "../endpoints/request.js"
import { Header, HeaderActionType } from "./frame/header";
import { Footer } from "./frame/footer.jsx";
import './create-room.css'

export function CreateRoomPage({setHeader, setFooterVis}) {
    const navigate = useNavigate();

    const [roomTitle, setRoomTitle] = useState("");
    const [roomDescription, setRoomDescription] = useState("");

    useEffect(()=>{
        setHeader(HeaderActionType.PROFILE);
        setFooterVis(true);
    }, []);

    function handleSubmit(event) {
        event.target.disabled = true;
        event.preventDefault();

        createRoom(new CreateRoomRequest(roomTitle, roomDescription))
        .then((roomID)=>{
            const url = new URL("/room", window.location.origin);
            url.searchParams.append("roomID", roomID);
            const path = url.pathname + url.search;
            navigate(path);
        })
        .catch((e)=>console.log(e))
        .finally(()=>event.target.disabled = false);
    }

    return (
        <div id="body">
            <nav id="create_room_nav">
                <menu>
                    <li><NavLink to="/discover">Discover Rooms</NavLink></li>
                    <li><NavLink className="selected">Create a Room</NavLink></li>
                </menu>
            </nav>
            <main id="create_room_main">
                <h1>Create Room:</h1>
                <form id="create_room_form" onSubmit={ev=>handleSubmit(ev)}>
                    <label htmlFor="roomname_input">Enter name of room:</label>
                    <input 
                        type="text" id="roomname_input" name="room" 
                        placeholder="Room Name" autoComplete="off" required 
                        value={roomTitle} onInput={ev=>setRoomTitle(ev.target.value)}
                    />
                    <label htmlFor="desc_input">Enter Description:</label>
                    <textarea 
                        id="desc_input" name="description" placeholder="Description..." 
                        autoComplete="off" value={roomDescription}
                        onInput={ev=>setRoomDescription(ev.target.value)}
                    ></textarea>
                    <input type="submit" value="Create"/>
                </form>
            </main>
        </div>
    );
}