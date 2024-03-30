import {get, Store} from "/js/local-store.js"
import {login, validateToken} from "/js/endpoints/api.js"
import {LoginRequest} from "/js/endpoints/request.js"

const home_page = "/html/discovery.html";

function tryLogin(event) {
    event.target.disabled = true;
    event.preventDefault();
    const username = document.getElementById("username_input").value;
    const password = document.getElementById("password_input").value;
    
    login(
        new LoginRequest(username, password)
    )
        .then(()=>window.location.replace(home_page))
        .catch((err)=>alert(err.message))
        .finally(()=>(event.target.disabled = false)); 
    return false;       
}

async function onLoad() {
    
    try {
        await validateToken(token);
        window.location.replace(home_page);
    } catch {
        console.log("Token Invalid");
    }
}


await onLoad();

document.querySelector("form").addEventListener("submit", (event) => tryLogin(event));