import {Store, save, get, remove} from "/js/local-store.js"
import {validateToken, getUser} from "/js/endpoints/api.js"
import {GetUserRequest} from "/js/endpoints/request.js";


function forceLogOut() {
    remove(Store.USER);
    remove(Store.TOKEN);
    window.location.replace('/')
}

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