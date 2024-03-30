import { getChatHistory } from "../../endpoints/api.js";
import { onLoad } from "./room-ws.js";
import {noteOn, noteOff } from './keyboard.js'
import { chatSocket } from "./room-ws.js";
import {EventType} from '../../models/music.js'

export const lockScrolling = {locked: true};

export async function setupPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('roomID');
    const messageHistory = await getChatHistory(roomID);
    messageHistory.forEach(message => onMessageEvent(message));
    const messages = document.getElementById("chat_messages");
    messages.addEventListener("scroll", (ev) => {
        if(ev.target.scrollTop >= (ev.target.scrollHeight - ev.target.offsetHeight)-10) {
            lockScrolling.locked = true;
        } else {
            lockScrolling.locked = false;
        }
    });

    document.querySelector("#messenger button").addEventListener("click", sendMessage);
    document.querySelector("#messenger textarea").addEventListener("keydown", (ev)=>{
        if(ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            messages.scrollTop = messages.scrollHeight;
            sendMessage();
        }
    });
    
    onLoad(
        message=>onMessageEvent(message), 
        count=>onViewCountEvent(count), 
        note=>onNoteEvent(note),
        error=>console.log(error)
    );

}

export function onMessageEvent(message) {
    const messages = document.getElementById("chat_messages");
    messages.appendChild(createMessageElement(message));
    if (lockScrolling.locked) messages.scrollTop = messages.scrollHeight;
}

export function onNoteEvent(noteEvent) {
    switch (noteEvent.event_type) {
        case EventType.NOTE_ON:
            noteOn(noteEvent.note);
            break;
        case EventType.NOTE_OFF:
            noteOff(noteEvent.note);
            break;
    }
}

export function onViewCountEvent({count}) {
    const span = document.getElementById("view_count");
    span.innerText = count.toString();
}

export function sendMessage() {
    const textarea = document.querySelector("#messenger textarea");
    const text = textarea.value;

    if (text && text !== "") {
        textarea.value = "";
        chatSocket.sendChatEvent({message: text});
    }
}

function createMessageElement(message) {
    const frame = document.createElement("div");
    frame.classList.add("message");
    frame.dataset.messageid = message._id;

    const img = document.createElement("img");
    img.src = message.owner.profile;
    img.classList.add("profile-pic", "profile-inv");
    img.draggable = "false";

    frame.appendChild(img);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");

    const username = document.createElement("label");
    username.appendChild(document.createTextNode(message.owner.username));
    contentDiv.appendChild(username);

    const content = document.createElement("p");
    content.appendChild(document.createTextNode(message.content));
    contentDiv.appendChild(content);

    frame.appendChild(contentDiv);

    return frame;
}