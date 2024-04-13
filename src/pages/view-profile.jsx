import React, { useContext, useEffect, useState } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import { Header, HeaderActionType } from "./frame/header";
import { Footer } from "./frame/footer";
import './view-profile.css'

import {editUserBio, editUserPicture} from "../endpoints/api.js"
import { FrameContext, UserContext } from "../app.jsx";

function PopUp({url, updateUrl, changeVisibility}){
    const {setUser} = useContext(UserContext);
    
    function cancel_url() {
        changeVisibility(false);
    }
    
    function onUrlChange() {
        const url = document.getElementById("image_url").value;
        const preview = document.querySelector("#preview_url img");
        preview.src = url;
    }
    
    function onUrlSave(event) {
        event.target.disabled = true;
        const url = document.getElementById("image_url").value;
        editUserPicture(url)
        .then((user)=>{
            setUser(()=>user);
            updateUrl(_=>url);
            changeVisibility(_=>false);
        })
        .catch((e)=>alert(e.message))
        .finally(()=>event.target.disabled=false);
    }

    return (
        <>
            <div id="popup_backdrop"></div>
            <div id="popup_content">
                <label htmlFor="image_url">Enter Image URL:</label>
                <input type="url" id="image_url" autoComplete="off" placeholder="https://domain.com/image"/>
                <div id="popup_button_row">
                    <button type="button" id="cancel_button" onClick={cancel_url}>Cancel</button>
                    <button type="button" id="preview_url_button" onClick={onUrlChange}>Preview</button>
                    <button type="submit" id="save_url_button"onClick={onUrlSave}>Save</button>
                </div>
                <div id="preview_url">
                    <img className="profile-pic profile-inv" src={url} alt="Preview" draggable="false"/>
                </div>
            </div>
        </>
    );
}

function Bio({changeFn, description, changeBio, saveBio}) {
    let content;
    let buttonText;
    if (changeFn.name === changeBio.name) {
        content = (<p id="bio_content">{description}</p>);
        buttonText = "Edit";
    } else if (changeFn.name === saveBio.name) {
        content = (<textarea id="bio_content" placeholder="Tell us about yourself! ..." defaultValue={description}></textarea>);
        buttonText = "Save";
    }

    return (
        <div id="bio">
            <h4>Bio:</h4>
            {content}
            <button id="bio_change" type="button" onClick={(ev)=>changeFn(ev)}>{buttonText}</button>
        </div>
    )
}

export function ViewProfilePage() {
    const navigate = useNavigate();
    const setFrame = useContext(FrameContext);    
    const {user, setUser} = useContext(UserContext);

    const [changeFn, updateChangeFn] = useState(()=>changeBio);
    const [currentUrl, updateUrl] = useState(user.profile);
    const [showPopup, changeVisibility] = useState(false);

    useEffect(()=>setFrame(HeaderActionType.PROFILE),[]);

    function changeBio() {
        updateChangeFn(()=>saveBio);
    }
    
    function saveBio(event) {
        event.target.disabled = true;
        const bio = document.getElementById("bio_content");
    
        editUserBio(bio.value)
        .then((user)=>{
            setUser(()=>user);
            updateChangeFn(()=>changeBio);
        })
        .catch((e)=>alert(e.message))
        .finally(()=>event.target.disabled=false);
    }

    function goBack() {
        navigate(-1)
    }

    function openPopup() {
        changeVisibility(true);
    }

    const description = (changeFn===changeBio && (user.description == null || user.description === ''))? 
                        'None':
                         user.description;

    const popup = showPopup? 
        <PopUp url={currentUrl} updateUrl={updateUrl} changeVisibility={changeVisibility} /> : 
        (null);
    
    return (
        <>
            <nav id="view_profile_nav">
                <menu>
                    <li><NavLink onClick={()=>goBack()}>❮ Back</NavLink></li>
                </menu>
            </nav>
            <main id="view_profile_main" >
                <div id="main_content">
                    <div id="profile_title">
                        <div id="your_profile">
                            <img className="profile-pic profile-inv" draggable="false" src={currentUrl} />
                            <span onClick={openPopup}>Change</span>
                        </div>
                        <label>{user.username}</label>
                    </div>
                    <Bio changeFn={changeFn} description={description} changeBio={changeBio} saveBio={saveBio}/>
                </div>
                {popup}
            </main>
        </>
    );
}

