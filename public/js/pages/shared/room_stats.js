import {getRoomStats} from "/js/endpoints/api.js"

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

async function onLoad() {
    const roomID = new URL(document.location).searchParams.get("roomID");
    const room = await getRoomStats(roomID);
    
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

    const date = document.getElementById("time_stamp");
    date.textContent = getStringTime(room.timeStamp);
}

await onLoad();