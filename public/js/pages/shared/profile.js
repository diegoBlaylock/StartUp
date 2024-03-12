import {logout} from "/js/endpoints/api.js"
import {get, Store} from "/js/local-store.js"
const home_page = "/";

function trySignOut(event) {
    event.target.disabled = true;
    event.preventDefault();
    if (window.getComputedStyle(event.target).display === "none") return;

    logout()
    .then(()=>window.location.replace(home_page))
    .catch((e)=>alert(e.message))
    .finally(()=>event.target.disabled = false);
}

function onLoad() {

    const user = get(Store.USER);

    document.getElementById("sign_out").addEventListener("click", (event) => trySignOut(event));
    document.querySelector(".my-profile").src = user.profile;
    document.querySelector(".dropdown-menu label").innerText = user.username;
}

onLoad();
