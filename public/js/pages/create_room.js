import {createRoom} from "/js/endpoints/api.js"
import {CreateRoomRequest} from "/js/endpoints/request.js"

function handleSubmit(event) {
    event.target.disabled = true;
    event.preventDefault();
    const title = document.getElementById("roomname_input").value;
    const description = document.getElementById("desc_input").value;

    createRoom(new CreateRoomRequest(title, description))
    .then((roomID)=>{
        const url = new URL("/html/view_player_room.html", window.location.origin);
        url.searchParams.append("roomID", roomID);
        window.location.replace(url.toString());
    })
    .catch((e)=>console.log(e))
    .finally(()=>event.target.disabled = false);
}

document.querySelector("form").addEventListener("submit", handleSubmit);