import {get_room_stats} from "/js/endpoints/api.js"

function getStringTime(timeStamp) {
    const date = new Date(timeStamp);
    return date.toLocaleTimeString();
}

function bsViewerCount() {
    return Math.ceil(Math.random()*50);
}

async function onLoad() {
    const room_id = new URL(document.location).searchParams.get("room_id");
    const room = get_room_stats(room_id);
    
    if(!room) {
        document.querySelector("main").innerHTML = "404 Not found";
        return
    }

    const title = document.getElementById("room_title")
    title.textContent = room.title;

    const img = document.querySelector("#player_profile img");
    img.src = room.owner.profile;

    const label = document.querySelector("#player_profile label");
    label.textContent = room.owner.username;

    const count = document.getElementById("view_count");
    count.textContent = bsViewerCount().toString();

    const date = document.getElementById("time_stamp");
    date.textContent = getStringTime(room.time_stamp);
}

onLoad();