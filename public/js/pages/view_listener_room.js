import {Banshee} from "/js/mocks/banshee.js"

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

const obj = {scroll: true};

function onMessageEvent(messageEvent) {
    const messages = document.getElementById("chat_messages");
    messages.appendChild(createMessageElement(messageEvent));
    if (obj.scroll) messages.scrollTop = messages.scrollHeight;
}

function onNoteEvent(noteEvent) {
    
}

function onLoad() {
    new Banshee(onMessageEvent);

    const messages = document.getElementById("chat_messages");
    messages.addEventListener("scroll", (ev) => {
        obj.scroll = false;
    });

    messages.addEventListener("scrollend", (ev) => {
        if(ev.target.scrollTop >= (ev.target.scrollHeight - ev.target.offsetHeight)-10) {
            obj.scroll = true;
        }
    });
}

onLoad();
