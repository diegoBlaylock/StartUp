import {get, Store} from "/js/local-store.js"
import {edit_user_bio, edit_user_picture} from "/js/endpoints/api.js"

function changeProfile(event) {
    document.getElementById("popup_content").style.display = "flex";
    document.getElementById("popup_backdrop").style.display = "flex";
    // try {
    //     edit_user_picture()
    // } catch(e) {
    //     alert(e);
    // }
}

function changeBio() {
    const user = get(Store.USER);
    const text_area = document.createElement("textarea");
    if(user.description !== null && user.description !== undefined) 
        text_area.value = user.description;
    text_area.id = "bio_content";
    text_area.placeholder = "Tell us about yourself! ...";
    const bio = document.getElementById("bio_content");
    bio.replaceWith(text_area);
    const button = document.getElementById("bio_change");
    button.innerText = "Save";
    change_fn = saveBio;
}

function saveBio() {
    const bio = document.getElementById("bio_content");

    try {
        edit_user_bio(bio.value);
    } catch(e) {
        alert(e);
        return;
    }
    const user = get(Store.USER);
    const paragraph = document.createElement("p");
    if(user.description !== null || user.description !== undefined) 
        paragraph.innerText = user.description;
    else {
        paragraph.innerText = "None";
    }
    paragraph.id = "bio_content";
    bio.replaceWith(paragraph);
    const button = document.getElementById("bio_change");
    button.innerText = "Edit";
    change_fn = changeBio;
}

let change_fn = changeBio;

function onLoad() {
    const user = get(Store.USER);

    document.querySelector("#your_profile img").src = user.profile;
    document.querySelector("#profile_title label").innerText = user.username;
    if(user.description === null || user.description === undefined || user.description === '') {
        document.getElementById("bio_content").innerText = 'None';
    } else {
        document.getElementById("bio_content").innerText = user.description;
    }
    
    document.getElementById("bio_change").addEventListener("click", ()=>change_fn());
    document.querySelector("#your_profile span").addEventListener("click", changeProfile);
}

onLoad();