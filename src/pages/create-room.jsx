import React from "react"

import { NavLink, useNavigate } from "react-router-dom";
import {createRoom} from "../endpoints/api.js"
import {CreateRoomRequest} from "../endpoints/request.js"
import { Header, HeaderActionType } from "../frame/header";
import { Footer } from "../frame/footer.jsx";
import './create-room.css'

export function CreateRoomPage() {
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.target.disabled = true;
        event.preventDefault();
        const title = document.getElementById("roomname_input").value;
        const description = document.getElementById("desc_input").value;

        createRoom(new CreateRoomRequest(title, description))
        .then((roomID)=>{
            const url = new URL("/view/room", window.location.origin);
            url.searchParams.append("roomID", roomID);
            const path = url.pathname + url.search;
            navigate(to=path);
        })
        .catch((e)=>console.log(e))
        .finally(()=>event.target.disabled = false);
    }

    return (
        <div id="body">
            <Header headerType={HeaderActionType.PROFILE}/>
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
                    <input type="text" id="roomname_input" name="room" placeholder="Room Name"  autoComplete="off" required />
                    <label htmlFor="desc_input">Enter Description:</label>
                    <textarea id="desc_input" name="description" placeholder="Description..." autoComplete="off"></textarea>
                    <input type="submit" value="Create"/>
                </form>
            </main>
            <Footer />
        </div>
    );
}