import React from "react";

import {logout} from "../endpoints/api.js"
import {get, Store} from "../utils/local-store.js"
import '../css/profile.css'

export default function Profile() {
    const user = get(Store.USER);

    function trySignOut(event) {
        event.target.disabled = true;
        event.preventDefault();
        if (window.getComputedStyle(event.target).display === "none") return;
    
        logout()
        .then(()=>window.location.replace(home_page))
        .catch((e)=>alert(e.message))
        .finally(()=>event.target.disabled = false);
    }

    return (
        <div id="header_profile">
            <img className="profile-pic my-profile" src={user.profile ?? "/resources/default_profile.png"} draggable="false"/>
            <div className="dropdown-menu">
                <label>{user.username}</label>
                <a href="view_user.html">View/Edit Profile</a>
                <a href="discovery.html">Discover Rooms</a>
                <a href="create_room.html">Create Room</a>
                <a id="sign_out" href="/index.html" onClick={(ev)=>trySignOut(ev)}>Sign Out</a>
            </div>
        </div>
    );
}