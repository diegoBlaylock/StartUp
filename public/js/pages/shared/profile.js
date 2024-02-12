import {sign_out} from "/js/endpoints/api.js"
import {CreateUserRequest} from "/js/endpoints/request.js"

const home_page = "/";

function trySignOut(event) {
    event.preventDefault();

    try {
        sign_out();
        window.location.replace(home_page);
    } catch(e) {
        console.log(e);
        alert(e);
    }

}

document.querySelector("#sign_out").href = addEventListener("click", (event) => trySignOut(event));

document.querySelector(".my-profile")