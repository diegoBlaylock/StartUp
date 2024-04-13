import React, { useContext, useEffect, useRef, useState } from "react"
import {HeaderActionType} from './frame/header'
import { NavLink } from "react-router-dom";
import {getRoomStats} from "../endpoints/api.js"
import { NotFoundPage } from "./not-found";
import Keyboard from "./room/keyboard.jsx";
import ChatBox from "./room/chat-box.jsx";
import { ChatSocket, MusicSocket } from "../endpoints/websockets.js"
import { openWebsocket } from "../endpoints/api.js"

import './view-room.css'
import { FrameContext, UserContext } from "../app.jsx";

export function ViewRoomPage() {
    const setFrame = useContext(FrameContext);
    const {user} = useContext(UserContext)

    const [room, updateRoom] = useState(null);
    const [wsReady, setWSReady] = useState(false);
    const chatSocket = useRef();
    const musicSocket = useRef();

    const roomID = new URL(document.location).searchParams.get("roomID");

    useEffect(()=>{
        setFrame(HeaderActionType.PROFILE, false, "room-comp");

        async function startWebsocket() {
            const socket = openWebsocket();
            const cchatSocket = new ChatSocket(socket);
            const mmusicSocket = new MusicSocket(socket);
    
            cchatSocket.addOpenListener(()=>cchatSocket.sendJoinRoomEvent(roomID));
            cchatSocket.addErrorListener((_, error) => console.log(error));
            
            chatSocket.current = cchatSocket;
            musicSocket.current = mmusicSocket;
            setWSReady(()=>true);
        }

        async function loadRoom() {
            const room = await getRoomStats(roomID);
            if(room) {
                
            }
            updateRoom(()=>((!room)?false:room));
        }        
        
        loadRoom();
        startWebsocket();
        
        return ()=>{
            chatSocket?.current?.close();
            musicSocket?.current?.close();
        }
    }, [])

    if(room===false) {
        return <NotFoundPage/>
    } else {
        const playable = room && user?._id === room?.owner?._id;
        return (
            <>
                <nav id="room_nav">
                    <menu>
                        <li><NavLink to='/discover'>❮ Back</NavLink></li>
                    </menu>
                </nav>
                <main id="room_main">
                    <div id="room_main_content" tabIndex={playable?"0":"-1"} autoFocus={playable} >
                        <h3 id="room_title">{room?.title ?? '--'}</h3>
                        <Keyboard playable={playable} musicSocket={musicSocket} wsReady={wsReady} />
                        <RoomStats room={room} chatSocket={chatSocket} wsReady={wsReady}/>
                    </div>
                    <ChatBox chatSocket={chatSocket} wsReady={wsReady}/>
                </main>
            </>
        );  
    }
}

function RoomStats({room, chatSocket, wsReady}) {
    const [count, updateCount] = useState();

    useEffect(()=>{
        if(wsReady)
            chatSocket.current.addViewerCountListener((_, {count})=>updateCount(count));
    },[wsReady]);

    function getStringTime(timeStamp) {
        if(timeStamp == null) return timeStamp;
        const date = new Date(timeStamp);
        const diff_days = new Date().getDate() - date;
        const diff_months = new Date().getMonth() - date.getMonth();
        const diff_years = new Date().getFullYear() - date.getFullYear();
    
        if (diff_days === 0 && diff_months === 0 && diff_years === 0) {
            return date.toLocaleTimeString();
        } else {
            return date.toLocaleDateString();
        }
    }

    return (
        <div id="room_info">
            <div id="player_profile">
                <img alt="profile" className="profile-pic profile-inv" src={room?.owner.profile ?? "--"} draggable="false"/>
                <label>{room?.owner.username ?? '--'}</label>
            </div>
            <p><span id="view_count">{count??'--'}</span> Viewers</p>
            <p>Playing since <span id="time_stamp">{getStringTime(room?.timeStamp) ?? "--"}</span></p>
        </div>
    );
}