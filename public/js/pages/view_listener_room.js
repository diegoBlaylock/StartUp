import {get, Store} from "/js/local-store.js"
import {noteOn, noteOff, setupKeyboard} from "/js/pages/shared/keyboard.js"
import { EventType } from "/js/models/music.js"
import { getChatHistory, openWebsocket } from "/js/endpoints/api.js"
import { ChatSocket, MusicSocket } from "../endpoints/websockets.js"


function createMessageElement(message) {
    const frame = document.createElement("div");
    frame.classList.add("message");

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

const lockScrolling = {locked: true};

function onMessageEvent(message) {
    const messages = document.getElementById("chat_messages");
    messages.appendChild(createMessageElement(message));
    if (lockScrolling.locked) messages.scrollTop = messages.scrollHeight;
}

function onNoteEvent(noteEvent) {
    switch (noteEvent.event_type) {
        case EventType.NOTE_ON:
            noteOn(noteEvent.note);
            break;
        case EventType.NOTE_OFF:
            noteOff(noteEvent.note);
            break;
    }
}

function sendMessage() {
    const textarea = document.querySelector("#messenger textarea");
    const text = textarea.value;

    if (text && text !== "") {
        const user = get(Store.USER)
        textarea.value = "";
        onMessageEvent({
            message_id: crypto.randomUUID(),
            owner: user,
            content: text,
            timeStamp: Date.now()
        });

        chatSocket.sendMessage({
            message_id: crypto.randomUUID(),
            owner: user,
            content: text,
            timeStamp: Date.now()
        });
    }
}

async function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('roomID');
    const messageHistory = await getChatHistory(roomID);
    messageHistory.forEach(message => onMessageEvent(message));

    setupKeyboard();

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
}

await onLoad();

const socket = openWebsocket();
const chatSocket = ChatSocket(socket);
const musicSocket = MusicSocket(socket);

chatSocket.addMessageListener((message) => console.log(message));//onMessageEvent(message));
chatSocket.addViewerCountListener((newCount) => null);
chatSocket.onError((error) => console.log(error));
musicSocket.addNoteEventListener(note => console.log(note));//onNoteEvent(note));