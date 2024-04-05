import React from 'react'
import Profile from './profile'
import './header.css'

export const HeaderActionType = Object.freeze({
    NONE: 0,
    CREATE_USER: 1,
    PROFILE: 2
}); 

function HeaderAction({headerType}) {
    switch (headerType) {
        case HeaderActionType.CREATE_USER:
            return (
                <div id="header_createUser">
                    <a href="html/create_user.html">Create User</a>
                </div>
            );
        case HeaderActionType.PROFILE:
            return (
                <Profile/>
            );
        case HeaderActionType.NONE:
        default:    
            return;

    }
}

export function Header({headerType}) {
    return (
        <header>
            <div className="flex-container">
                <div id="header_title">
                    <h1 id="app_name_label">Cristofori's Café</h1>
                </div>
                <div id="header_logo">
                    <img src="resources/piano_logo.png" alt="logo" draggable="false"/>
                </div>
                < HeaderAction headerType={headerType}/>
            </div>
        </header>
    );
}
