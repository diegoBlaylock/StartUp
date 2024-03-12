import {createUser} from "/js/endpoints/api.js"
import {CreateUserRequest} from "/js/endpoints/request.js"

const home_page = "/html/discovery.html";

function tryCreateUser(event) {
    event.target.disabled=true;
    event.preventDefault();
    const username = document.getElementById("username_input").value;
    const email = document.getElementById("email_input").value;
    const password = document.getElementById("password_input").value;
    const confirm_password = document.getElementById("confirm_password_input").value;

    if(password !== confirm_password) {
        alert("Passwords don't match!");
        return;
    }

    createUser(new CreateUserRequest(username, email, password))
    .then(()=>window.location.replace(home_page))
    .catch((err)=>alert(err.message))
    .finally(()=>event.target.disabled=false);
    return false;
}

document.querySelector("form").addEventListener("submit", (event) => tryCreateUser(event));