import {get, Store} from "../local-store.js"
import {login, validate_token} from "../endpoints/api.js"
import {LoginRequest} from "../endpoints/request.js"

const home_page = "/html/discover.html";

function tryLogin() {
    const username = document.getElementById("username_input").value;
    const password = document.getElementById("password_input").value;

    try {
        login(
            new LoginRequest(username, password)
        );

        window.location.replace(home_page);
    } catch(e) {
        console.log(e);
    }
}

function onLoad() {
    const token = get(Store.TOKEN);
    if(token !== null) {
        try {
            validate_token(token);
            window.location.replace(home_page);
        } catch {
            console.log("Token Invalid");
        }
    }
}


window.onload = onLoad;
window.tryLogin = tryLogin;