import {Search, Filter, RoomRequest} from "/js/endpoints/request.js"
import {discoverRooms} from "/js/endpoints/api.js"
import {Store, get} from "/js/local-store.js"


function generateRoomCard(room) {
    const card = document.createElement("a");
    card.className = "room-desc";
    card.dataset.id = room.roomID;

    const title = document.createElement("h2");
    title.textContent = room.title;
    title.title = room.description;
    card.appendChild(title);

    const img = document.createElement("img");
    img.classList.add("profile-pic", "profile-inv");
    img.src = room.owner.profile;
    img.draggable = "false";
    card.appendChild(img);

    const label = document.createElement("label");
    label.title = room.owner.description;
    label.appendChild(document.createTextNode("by "));

    const span = document.createElement("span");
    span.classList.add("username");
    span.innerText = room.owner.username;
    label.appendChild(span);
    card.appendChild(label);

    const userID = get(Store.USER).userID;
    const url = new URL(
        (userID === room.owner.userID)?  "/html/view_player_room.html": "/html/view_listener_room.html" ,
        window.location.origin
    );
    url.searchParams.append("roomID", room.roomID);
    card.href = url.href;
    return card;
}

function changePage(el) {
    const page = parseInt(this.dataset.page??"1") - 1;
    loadRooms(page);
}

function getSearchFilterParameters() {
    let search_type = document.getElementById("search_type").value;
    let search_param = document.getElementById("search_param").value;
    let filter_type = document.getElementById("filter_type").value;

    search_type = (search_type === "user")? Search.USER : Search.ROOM;
    filter_type = (filter_type === "popularity")? Filter.POPULARITY : Filter.TIME_STAMP;

    return [search_type, search_param, filter_type];
}

async function loadRooms(page) {
    const [search_type, search_param, filter_type] = getSearchFilterParameters();
    const request = new RoomRequest(page, filter_type, search_type, search_param);

    try {
        const response = await discoverRooms(request);
        const room_div = document.getElementById("roomspage");
        while (room_div.firstChild) {
            room_div.removeChild(room_div.firstChild);
        }
        response.rooms.forEach(element => room_div.appendChild(generateRoomCard(element)));

        const pagebar = document.querySelector(".pagebar");
        while (pagebar.firstChild) {
            pagebar.removeChild(pagebar.firstChild);
        }

        let range;
        if(response.total <= 5 || response.num < 2) {
            range = [1, Math.min(5, response.total)];
        } else if(response.num+2 >= response.total) {
            range = [response.total - 4, response.total];
        } else {
            range = [response.num - 1, response.num + 3];
        }

        if (range[0] > 1) pagebar.appendChild(document.createTextNode("…"));

        for(let i = range[0]; i <= range[1]; i++) {
            const anchor = document.createElement("a");
            anchor.textContent = i.toString();
            anchor.dataset.page = i.toString();
            if(i-1 === response.num) {
                anchor.classList.add("selected-page", "disabled");
            } else{ 
                anchor.addEventListener("click", changePage);
            }
            pagebar.appendChild(anchor);
        }

        if (range[1] < response.total) pagebar.appendChild(document.createTextNode("…"));

    } catch(e) {
        console.log(e);
    }

}


loadRooms();
document.getElementById("search_type").addEventListener("change", ()=> {
    if(document.getElementById("search_param").value) loadRooms()
});

document.getElementById("filter_type").addEventListener("change", ()=> loadRooms());
document.getElementById("search_param").addEventListener("keyup", (event)=> {
    if(event.key === "Enter") loadRooms();    
});

