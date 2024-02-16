function generateRoomCard(room) {
    const card = document.createElement("a");
    card.className = "room-desc"
    card.dataset.id = room.room_id;

    card.insertAdjacentHTML(
        "beforeend", 
        `<h2>${room.title}</h2>\n` +
        `<img class="profile-pic" src="${room.owner.profile}" draggable="false"/>\n` +
        `<label title="${room.owner.description}">by <span class="username">${room.owner.username}</span></label>`
    );

    const user_id = get(Store.USER).user_id;
    card.href = (user_id === room.owner.user_id)? "view_player_room.html": "view_listener_room.html";

    return card;
}


