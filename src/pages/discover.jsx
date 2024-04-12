import React, { useContext, useEffect, useState } from 'react'
import { HeaderActionType } from './frame/header'
import './discover.css'

import {Search, Filter, RoomRequest} from "../endpoints/request.js"
import {discoverRooms} from "../endpoints/api.js"
import { NavLink} from 'react-router-dom'
import { FrameContext } from '../app.jsx'

export function DiscoverPage () {
    const [rooms, setRooms] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchType, setSearchType] = useState("user");
    const [searchParam, setSearchParam] = useState("");
    const [sortType, setSortType] = useState();
    const setFrame = useContext(FrameContext);

    async function loadRooms(page) {
        const [search_type, search_param, filter_type] = getSearchFilterParameters(sortType, searchType, searchParam);
        const request = new RoomRequest(page, filter_type, search_type, search_param);
    
        try {
            const response = await discoverRooms(request);
            setCurrentPage(()=>response.num);
            setRooms(()=>response);
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(()=>{
        if(rooms && rooms.rooms) {
            rooms.rooms.forEach(async room => {
                const img = new Image();
                img.src = room.owner.profile;
            });
        }
    }, [rooms]);

    useEffect(()=>{
        loadRooms(currentPage);
    }, [currentPage, sortType]);

    useEffect(()=>{
        if (searchParam) loadRooms();
    }, [searchType]);

    useEffect(()=>setFrame(HeaderActionType.PROFILE), []);

    return (
        <>
            <nav id="discover_nav">
                <menu>
                    <li><NavLink className="selected">Discover Rooms</NavLink></li>
                    <li><NavLink to="/create/room">Create a Room</NavLink></li>
                </menu>
            </nav>
            <main id="discover_main">
                <div id="roomspage">
                    {rooms?.rooms?.map((room, i)=><RoomCard room={room} key={i}/>)}
                </div>
                <PageBar num={rooms?.num??0} total={rooms?.total??0} setCurrentPage={setCurrentPage} />
            </main>
            <div id="search_bar">
                <div id="search">
                    <label>Search by:</label>
                    <select id="search_type" title="How to search by." onChange={(ev)=>setSearchType(ev.target.value)}>
                        <option>user</option>
                        <option>room</option>
                    </select>
                    <input id="search_param" type="text" placeholder="Type and press Enter" autoComplete="off" value={searchParam} onInput={(ev)=>setSearchParam(ev.target.value)} 
                    onKeyUp={(event)=> {
                        if(event.key === "Enter") loadRooms();    
                    }}/>
                </div>    
                <div id="filter">
                    <label>Filter by:</label>
                    <select id="filter_type" title="Choose how to Filter." onChange={ev=> setSortType(ev.target.value)}>
                        <option defaultValue={true}>time playing</option>
                        <option>popularity</option>
                    </select>
                </div>    
            </div>
        </>
    )
}

function RoomCard({room}) {
    const url = new URL("/room",window.location.origin);
    url.searchParams.append("roomID", room._id);
    const path = url.pathname+url.search;   
    
    return (
        <NavLink to={path} className='room-desc' data-id={room._id}>
            <h2 title={room.description}>{room.title}</h2>
            <img alt="room-pic" className='profile-pic profile-inv' src={room.owner.profile} draggable="false"/>
            <label title={room.owner.description}>by <span className='username'>{room.owner.username}</span></label>
        </NavLink>
    );
}

function PageBar({num, total, setCurrentPage}) {
    let range;
    if(total <= 5 || num < 2) {
        range = [1, Math.min(5, total)];
    } else if(num+2 >= total) {
        range = [total - 4, total];
    } else {
        range = [num - 1, num + 3];
    }
    const links = [];
    if (range[0] > 1) links.push("…");
    for(let i = range[0]; i <= range[1]; i++) {
        links.push(
            <a 
                key={i}
                data-page={i.toString()} 
                className={i-1 === num? 'selected-page disabled':null}
                onClick={i-1 !== num? (ev)=>changePage(ev, setCurrentPage): null}
            >{i.toString()}</a>
        );
    }
    if (range[1] < total) links.push("…");
      
    return <div className="pagebar">{links}</div>
}

function changePage(el, setCurrentPage) {
    const page = parseInt(el.target.dataset.page??"1") - 1;
    setCurrentPage(page);
}

function getSearchFilterParameters(filter_type, search_type, search_param) {
    search_type = (search_type === "user")? Search.USER : Search.ROOM;
    filter_type = (filter_type === "popularity")? Filter.POPULARITY : Filter.TIME_STAMP;

    return [search_type, search_param, filter_type];
}

