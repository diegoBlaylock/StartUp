import { useEffect } from "react";
import {useNavigate} from "react-router-dom";

import {Store, save, get, remove} from "../../utils/local-store.js"
import {validateToken, getUser} from "../../endpoints/api.js"
import {GetUserRequest} from "../../endpoints/request.js";

export function Authenticator({setLoaded}) {
    const navigate = useNavigate();

    function forceLogOut() {
        remove(Store.USER);
        navigate('/login');
    }

    async function checkPassports() {
        try {
            const auth = await validateToken()
            if (get(Store.USER) == null) {
                const user = await getUser(new GetUserRequest(auth.userID));
                if(user) save(Store.USER, user);
            }    

            if(setLoaded != null) setLoaded(true);
        } catch {
            forceLogOut()
        }
    }

    useEffect(()=>{
        checkPassports()
    }, []);
    
    return (null);
}
