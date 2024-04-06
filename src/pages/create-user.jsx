import React from 'react';

import { Header, HeaderActionType } from '../frame/header'
import { Footer } from '../frame/footer'
import './create-user.css'

export function CreateUserPage() {

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

    return (
        <div id="body">
            <Header headerType={HeaderActionType.None}/>
            <main id="create_user_main">
                <h1>Create User:</h1>
                <form id="create_user_form" onSubmit={tryCreateUser}>
                    <label htmlFor="username_input">Enter username:</label>
                    <input type="text" id="username_input" name="username" placeholder="username" required />
                    <label htmlFor="email_input">Enter email:</label>
                    <input type="email" id="email_input" name="email" placeholder="email" required />
                    <label htmlFor="password_input">Enter password:</label>
                    <input type="password" id="password_input" name="password" placeholder="password" required />
                    <label htmlFor="confirm_password_input">Confirm password:</label>
                    <input type="password" id="confirm_password_input" placeholder="retype password" required />
                    <input type="submit" value="Create"/>
                </form>
            
            </main>
            <Footer />
        </div>
    );
}