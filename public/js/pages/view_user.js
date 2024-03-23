import {get, Store} from "/js/local-store.js"
import {editUserBio, editUserPicture} from "/js/endpoints/api.js"

function changeProfile(event) {
    document.getElementById("popup_content").style.display = "flex";
    document.getElementById("popup_backdrop").style.display = "flex";
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

function saveBio(event) {
    event.target.disabled = true;
    const bio = document.getElementById("bio_content");

    editUserBio(bio.value)
    .then(()=>{
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
    })
    .catch((e)=>alert(e.message))
    .finally(()=>event.target.disabled=false);
}

function cancel_url() {
    document.getElementById("image_url").value = ""
    document.getElementById("popup_content").style.display = "none";
    document.getElementById("popup_backdrop").style.display = "none";
}

async function isImgUrl(url) {
    // TODO: Cors prevents me from doing this here, but a serverside request could work
    return true;
}

function onUrlChange() {
    const url = document.getElementById("image_url").value;
    
    const preview = document.querySelector("#preview_url img");
    if(true) {
        preview.src = url;
    } else if(preview.src !== current_url) {
        preview.src = current_url;
    }
}

function onUrlSave(event) {
    event.target.disabled = true;
    const url = document.getElementById("image_url").value;
    editUserPicture(url)
    .then(()=>{
        document.querySelector("#your_profile img").src = url;
        document.querySelector('.my-profile').src = url;
        cancel_url();
    })
    .catch((e)=>alert(e.message))
    .finally(()=>event.target.disabled=false);
}

let change_fn = changeBio;
let current_url = null;

function onLoad() {
    const user = get(Store.USER);

    current_url = user.profile;
    document.querySelector("#your_profile img").src = user.profile;
    document.querySelector("#profile_title label").innerText = user.username;
    if(user.description == null || user.description === '') {
        document.getElementById("bio_content").innerText = 'None';
    } else {
        document.getElementById("bio_content").innerText = user.description;
    }
    
    document.getElementById("bio_change").addEventListener("click", (event)=>change_fn(event));
    document.querySelector("#your_profile span").addEventListener("click", changeProfile);
    document.getElementById("cancel_button").addEventListener("click", cancel_url);
    document.getElementById('save_url_button').addEventListener("click", onUrlSave);
    document.getElementById("preview_url_button").addEventListener("click", onUrlChange);
}

onLoad();