import {Store, save, get, remove} from "/js/local-store.js"
import {validateToken, getUser} from "/js/endpoints/api.js"
import {GetUserRequest} from "/js/endpoints/request.js";


function forceLogOut() {
    remove(Store.USER);
    window.location.replace('/')
}

validateToken(token)
.then((auth)=>{
    if (get(Store.USER) == null) {
        return getUser(new GetUserRequest(auth.userID));
    }
})
.then(user=>{
    if(user) save(Store.USER, user);
})
.catch(()=>forceLogOut());