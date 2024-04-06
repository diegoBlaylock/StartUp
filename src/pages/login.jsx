import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

import { Header, HeaderActionType } from '../frame/header'
import { Footer } from '../frame/footer'
import './login.css'

import {login, validateToken} from "../endpoints/api.js"
import {LoginRequest} from "../endpoints/request.js"


export function LoginPage () {
    const [loaded, setLoad] = useState(false);
    const navigate = useNavigate();

    async function tryLogin(event) {
        event.target.disabled = true;
        event.preventDefault();
        const username = document.getElementById("username_input").value;
        const password = document.getElementById("password_input").value;
        
        login(
            new LoginRequest(username, password)
        )
            .then(()=>navigate('/discover'))
            .catch((err)=>alert(err.message))
            .finally(()=>(event.target.disabled = false)); 
        return false;       
    }

    useEffect(()=>{
        async function setup() {
            try {
                await validateToken(token);
                window.location.replace(home_page);
            } catch {
                console.log("Token Invalid");
            }
            setLoad(true);
        }
        setup();
    }, []);

    if(loaded) {
        return (
            <div id="body">
                <Header headerType={HeaderActionType.CREATE_USER}/>
                <main id="login_main">
                    <h1>Log In</h1>
                    <form id="login_form" onSubmit={event=>tryLogin(event)}>
                            <label htmlFor="username_input">Enter username:</label>
                            <input type="text" id="username_input" name="username" placeholder="username" required/>
                            <label htmlFor="password_input">Enter password:</label>
                            <input type="password" id="password_input" name="password" placeholder="password" required/>
                            <input type="submit" value="Login"/>
                    </form>
                
                </main>
                <Footer />
            </div>
        );
    } else {
        return (null);
    }
}
