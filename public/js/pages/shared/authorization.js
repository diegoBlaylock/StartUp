import {Store, save, get, remove} from "/js/local-store.js"
import {validateToken, getUser} from "/js/endpoints/api.js"
import {GetUserRequest} from "/js/endpoints/request.js";


function forceLogOut() {
    remove(Store.USER);
    remove(Store.TOKEN);
    window.location.replace('/')
}

fetch("https://api.quotable.io/random")
.then(response=>response.json())
.then(json=>console.log(json.content, "- " + json.author));

const token = get(Store.TOKEN);
if(token != null) {
    validateToken(token)
    .then((auth)=>{
        if (get(Store.USER) == null) {
            const user = getUser(new GetUserRequest(auth.userID));
            save(Store.USER, user);
        }    
    })
    .catch(()=>forceLogOut());
} else {
    forceLogOut()
}