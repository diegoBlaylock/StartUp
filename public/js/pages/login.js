import {get, Store} from "../local-store"
import {login, validate_token} from "../endpoints/api"
import {LoginRequest} from "../endpoints/request"

const home_page = "/html/discover.html";

async function tryLogin() {
    const username = document.getElementById("username_input").value;
    const password = document.getElementById("password_input").value;

    try {
        login(
            new LoginRequest(username, password)
        );

        window.location.replace(home_page);
    } catch(e) {
        console.log("Pysch")
    }
}

function onLoad() {
    const token = get(Store.TOKEN);
    if(token !== null) {
        try {
            validate_token(token);
            window.location.replace(home_page);
        } catch {}
    }
}


window.onload = onLoad;