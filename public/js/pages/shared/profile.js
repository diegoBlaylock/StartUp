import {sign_out} from "/js/endpoints/api.js"
import {get, Store} from "/js/local-store.js"
const home_page = "/";

function trySignOut(event) {
    event.preventDefault();
    if (window.getComputedStyle(event.target).display === "none") return;
    try {
        sign_out();
        window.location.replace(home_page);
    } catch(e) {
        console.log(e);
        alert(e);
    }

}

function onLoad() {

    const user = get(Store.USER);

    document.getElementById("sign_out").addEventListener("click", (event) => trySignOut(event));
    document.querySelector(".my-profile").src = user.profile;
    document.querySelector(".dropdown-menu label").innerText = user.username;
}

onLoad();
