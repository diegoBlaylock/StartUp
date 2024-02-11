import {get, Store} from "../local-store.js"
import {login, validate_token} from "../endpoints/api.js"
import {LoginRequest} from "../endpoints/request.js"

const home_page = "/html/discover.html";

function tryCreateUser() {
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

window.onload = onLoad;

document.querySelector("form").action = 'javascript:tryCreateUser()';