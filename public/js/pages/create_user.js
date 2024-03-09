import {createUser} from "/js/endpoints/api.js"
import {CreateUserRequest} from "/js/endpoints/request.js"

const home_page = "/html/discovery.html";

function tryCreateUser(event) {
    event.preventDefault();
    const username = document.getElementById("username_input").value;
    const email = document.getElementById("email_input").value;
    const password = document.getElementById("password_input").value;
    const confirm_password = document.getElementById("confirm_password_input").value;

    if(password !== confirm_password) {
        alert("Passwords don't match!");
        return;
    }

    try {
        createUser(
            new CreateUserRequest(username, email, password)
        );
        window.location.replace(home_page);
    } catch(e) {
        alert(e);
    }

}

document.querySelector("form").addEventListener("submit", (event) => tryCreateUser(event));