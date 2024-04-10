import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'

import './create-user.css'
import { FrameContext, UserContext } from '../app';
import { HeaderActionType } from './frame/header';

export function CreateUserPage() {
    const setFrame = useContext(FrameContext);
    const {setUser} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=> setFrame(HeaderActionType.NONE), []);

    function tryCreateUser(event) {
        event.target.disabled=true;
        event.preventDefault();
    
        if(password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        } else if (password.length < 8) {
            alert("Password needs to be longer (8 characters)")
            return
        }
    
        createUser(new CreateUserRequest(username, email, password))
            .then((user)=>{
                setUser(()=>user);
                navigate('/discover');
            })
            .catch((err)=>alert(err.message))
            .finally(()=>event.target.disabled=false);
        return false;
    }

    return (
        <main id="create_user_main">
            <h1>Create User:</h1>
            <form id="create_user_form" onSubmit={tryCreateUser}>
                <label htmlFor="username_input">Enter username:</label>
                <input type="text" id="username_input" name="username" placeholder="username" required value={username} onInput={(ev)=>setUsername(ev.target.value)}/>
                <label htmlFor="email_input">Enter email:</label>
                <input type="email" id="email_input" name="email" placeholder="email" required value={email} onInput={(ev)=>setEmail(ev.target.value)} />
                <label htmlFor="password_input">Enter password:</label>
                <input type="password" id="password_input" name="password" placeholder="password" required value={password} onInput={(ev)=>setPassword(ev.target.value)} />
                <label htmlFor="confirm_password_input">Confirm password:</label>
                <input type="password" id="confirm_password_input" placeholder="retype password" required value={confirmPassword} onInput={(ev)=>setConfirmPassword(ev.target.value)} />
                <input type="submit" value="Create"/>
            </form>
        </main>
    );
}