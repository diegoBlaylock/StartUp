import {create_room} from "/js/endpoints/api.js"
import {CreateRoomRequest} from "/js/endpoints/request.js"

function handleSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("roomname_input").value;
    const description = document.getElementById("desc_input").value;

    try {
        const room_id = create_room(new CreateRoomRequest(title, description));
        const url = new URL("/html/view_player_room.html", window.location.origin);
        url.searchParams.append("room_id", room_id);
        window.location.replace(url.toString());
    } catch(e) {
        console.log(e);
    }
}

document.querySelector("form").addEventListener("submit", handleSubmit);