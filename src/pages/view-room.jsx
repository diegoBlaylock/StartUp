import React, { useEffect, useState } from "react"
import {Header, HeaderActionType} from './frame/header'
import { NavLink } from "react-router-dom";
import { get, Store } from "../utils/local-store";
import {getRoomStats} from "../endpoints/api.js"
import { NotFoundPage } from "./not-found";
import Keyboard from "./room/keyboard.jsx";
import ChatBox from "./room/chat-box.jsx";
import { ChatSocket, MusicSocket } from "../endpoints/websockets.js"
import { openWebsocket } from "../endpoints/api.js"

import './view-room.css'

export function ViewRoomPage() {
    const [room, updateRoom] = useState(null);
    const [{chatSocket, musicSocket}, updateSockets] = useState({});

    
    useEffect(()=>{
        
        async function onLoad() {
            const roomID = new URL(document.location).searchParams.get("roomID");
            const room = await getRoomStats(roomID);
            if(room) {
                const socket = openWebsocket();
                const cchatSocket = new ChatSocket(socket);
                const mmusicSocket = new MusicSocket(socket);
        
                cchatSocket.addOpenListener(()=>cchatSocket.sendJoinRoomEvent(roomID));
                cchatSocket.addErrorListener((_, error) => console.log(error));
        
                updateSockets(()=>({
                    socket: socket,
                    chatSocket: cchatSocket,
                    musicSocket: mmusicSocket
                }));
            }
            updateRoom(()=>((!room)?false:room));
        }        
        
        onLoad();
        
        return ()=>{
            chatSocket?.close();
            musicSocket?.close();
        }
    }, [])

    if (room == null) {

    } else if(!room) {
        return <NotFoundPage/>
    } else {
        const playable = get(Store.USER)._id === room.owner?._id;
        return (
            <div id="body">
                <Header className="room-comp" headerType={HeaderActionType.PROFILE}/>   
                <nav id="room_nav">
                    <menu>
                        <li><NavLink to='/discover'>❮ Back</NavLink></li>
                    </menu>
                </nav>
                <main id="room_main">
                    <div id="room_main_content">
                        <h3 id="room_title">{room.title}</h3>
                        <Keyboard playable={playable} musicSocket={musicSocket}/>
                        <RoomStats room={room} chatSocket={chatSocket}/>
                    </div>
                    <ChatBox chatSocket={chatSocket}/>
                </main>
            </div>
        );  
    }
}

function RoomStats({room, chatSocket}) {
    const [count, updateCount] = useState();

    useEffect(()=>{
        chatSocket.addViewerCountListener((_, {count})=>updateCount(count));
    },[]);

    function getStringTime(timeStamp) {
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
                <img className="profile-pic profile-inv" src={room.owner.profile} draggable="false"/>
                <label>{room.owner.username}</label>
            </div>
            <p><span id="view_count">{count??'--'}</span> Viewers</p>
            <p>Playing since <span id="time_stamp">{getStringTime(room.timeStamp)}</span></p>
        </div>
    );
}