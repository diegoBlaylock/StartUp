import {get, Store} from "/js/local-store.js"
import {login, validateToken} from "/js/endpoints/api.js"
import {LoginRequest} from "/js/endpoints/request.js"

const home_page = "/html/discovery.html";

function tryLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username_input").value;
    const password = document.getElementById("password_input").value;

    try {
        login(
            new LoginRequest(username, password)
        );

        window.location.replace(home_page);
    } catch(e) {
        alert(e);
    }
}

function onLoad() {
    const token = get(Store.TOKEN);
    if(token !== null) {
        try {
            validateToken(token);
            window.location.replace(home_page);
        } catch {
            console.log("Token Invalid");
        }
    }
}


window.onload = onLoad;

document.querySelector("form").addEventListener("submit", (event) => tryLogin(event));