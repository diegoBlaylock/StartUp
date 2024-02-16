import {get, Store} from "/js/local-store.js"
import {edit_user_bio, edit_user_picture} from "/js/endpoints/api.js"

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
    isImgUrl(url)
    .then((bool)=>{
        const preview = document.querySelector("#preview_url img");
        if(bool) {
            preview.src = url;
        } else if(preview.src !== current_url) {
            preview.src = current_url;
        }
    })
    .catch(()=>{});
}

function onUrlSave() {
    const url = document.getElementById("image_url").value;
    edit_user_picture(url);
    document.querySelector("#your_profile img").src = url;
    document.querySelector('.my-profile').src = url;
    cancel_url();
}

let change_fn = changeBio;
let current_url = null;

function onLoad() {
    const user = get(Store.USER);

    current_url = user.profile;
    document.querySelector("#your_profile img").src = user.profile;
    document.querySelector("#profile_title label").innerText = user.username;
    if(user.description === null || user.description === undefined || user.description === '') {
        document.getElementById("bio_content").innerText = 'None';
    } else {
        document.getElementById("bio_content").innerText = user.description;
    }
    
    document.getElementById("bio_change").addEventListener("click", ()=>change_fn());
    document.querySelector("#your_profile span").addEventListener("click", changeProfile);
    document.getElementById("cancel_button").addEventListener("click", cancel_url);
    document.getElementById('save_url_button').addEventListener("click", onUrlSave);
    document.getElementById("preview_url_button").addEventListener("click", onUrlChange);
}

onLoad();