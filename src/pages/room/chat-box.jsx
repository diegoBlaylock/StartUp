import React, { useEffect, useState } from "react"
import { getChatHistory } from "../../endpoints/api";

export default function ChatBox({chatSocket, wsReady}){
    const [messages, updateMessages] = useState();
    const [scrollInfo, updateScrollInfo] = useState({locked: true});

    async function onLoad() {
        const roomID = new URL(document.location).searchParams.get("roomID");
        const messageHistory = await getChatHistory(roomID);
        updateMessages(messageHistory);
    }

    async function setUpChatSocket() {
        if(wsReady)
            chatSocket.current.addMessageListener((_, message) => {
                updateMessages(ls=>{
                    return [...ls, message];
                });
            });
    }

    function handleMessagesChanged() {
        const messagesComponent = document.getElementById("chat_messages");
        if (scrollInfo.locked && messagesComponent) messagesComponent.scrollTop = messagesComponent?.scrollHeight;
    }

    useEffect(()=>{onLoad()},[]);
    useEffect(()=>{setUpChatSocket()}, [wsReady])
    useEffect(()=>handleMessagesChanged, [messages]);


    function sendMessage(text) {
        if(messages == null) return;
        chatSocket.current.sendChatEvent({message: text});
        scrollInfo.locked = true;
        updateScrollInfo(()=>scrollInfo);
    }

    function handleScroll(ev) {
        if(messages == null) return;
        if(ev.target.scrollTop >= (ev.target.scrollHeight - ev.target.offsetHeight)-10) {
            scrollInfo.locked = true
        } else {
            scrollInfo.locked = false;
        }
        updateScrollInfo(scrollInfo);
    }

    return (
        <div id="chat_content">
            <div id="chat_messages" onScroll={ev=>handleScroll(ev)}>
                {messages?.map(message=><Message message={message} key={message._id}/>)}    
            </div>
            <Messenger sendMessage={sendMessage}/>
        </div>
    );
}

function Messenger({sendMessage}) {
    const [text, updateText] = useState("");

    function handleSend() {
        if (text && text !== "") {
            updateText(()=>"");
            sendMessage(text);
        }
    }

    function handleKeyStroke (ev) {
        if(ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            handleSend();
        }
    }
    
    return (
        <div id="messenger">
            <textarea onKeyDown={handleKeyStroke} value={text} onInput={ev=>updateText(ev.target.value)} placeholder="Send Message..."></textarea>
            <button type="button" onClick={handleSend}><img src="/resources/arrow.png" alt="Send" draggable="false"/></button>
        </div>
    );
}

function Message({message}) {
    return (
        <div className="message" data-messageid={message._id}>
            <img src={message.owner.profile} className="profile-pic profile-inv" draggable={false}/>
            <div className="message-content">
                <label>{message.owner.username}</label>
                <p>{message.content}</p>
            </div>
        </div>
    );
}