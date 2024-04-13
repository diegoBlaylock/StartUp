import React, { useContext, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

import { Header, HeaderActionType } from './frame/header'
import { Footer } from './frame/footer'
import './login.css'

import {login, validateToken} from "../endpoints/api.js"
import {LoginRequest} from "../endpoints/request.js"
import {FrameContext, UserContext} from '../app.jsx'

export function LoginPage () {
    const setFrame = useContext(FrameContext);
    const {setUser} = useContext(UserContext);
    const [loaded, setLoad] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function tryLogin(event) {
        event.target.disabled = true;
        event.preventDefault();
        
        login(new LoginRequest(username, password))
            .then((user)=>{
                setUser(()=>user);
                navigate('/discover');
            })
            .catch((err)=>alert(err.message))
            .finally(()=>(event.target.disabled = false)); 
        return false;       
    }

    useEffect(()=>{
        async function setup() {
            try {
                await validateToken();
                navigate('/discover');
            } catch(e) {
                console.log("Token Invalid");
            }
            
            setLoad(()=>true);
        }
        setup();
    }, []);
    
    useEffect(()=>setFrame(HeaderActionType.CREATE_USER, true), []);

    if(loaded) {
        return (
            <main id="login_main">
                <h1>Log In</h1>
                <form id="login_form" onSubmit={event=>tryLogin(event)}>
                        <label htmlFor="username_input">Enter username:</label>
                        <input 
                            type="text" id="username_input" name="username" 
                            placeholder="username" required value={username}
                            onInput={ev=>setUsername(ev.target.value)}    
                        />
                        <label htmlFor="password_input">Enter password:</label>
                        <input 
                            type="password" id="password_input" name="password" 
                            placeholder="password" required value={password} 
                            onInput={ev=>setPassword(ev.target.value)}    
                        />
                        <input type="submit" value="Login"/>
                </form>
            
            </main>
        );
    } else {
        return <div id="body">

        </div>;
    }
}
