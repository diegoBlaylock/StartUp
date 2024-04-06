import React from "react";

import {logout} from "../endpoints/api.js"
import {get, Store} from "../utils/local-store.js"
import '../css/profile.css'
import { NavLink, useNavigate } from "react-router-dom";

export default function Profile() {
    const user = get(Store.USER);
    const navigate = useNavigate();

    function trySignOut(event) {
        event.target.disabled = true;
        event.preventDefault();
        if (window.getComputedStyle(event.target).display === "none") return;
    
        logout()
        .then(()=>navigate('/login'))
        .catch((e)=>alert(e.message))
        .finally(()=>event.target.disabled = false);
    }

    return (
        <div id="header_profile">
            <img className="profile-pic my-profile" src={user?.profile ?? "/resources/default_profile.png"} draggable="false"/>
            <div className="dropdown-menu">
                <label>{user?.username}</label>
                <NavLink to="/view/user">View/Edit Profile</NavLink>
                <NavLink to="discover">Discover Rooms</NavLink>
                <NavLink to="/create/room">Create Room</NavLink>
                <NavLink id="sign_out" to="/login" onClick={(ev)=>trySignOut(ev)}>Sign Out</NavLink>
            </div>
        </div>
    );
}