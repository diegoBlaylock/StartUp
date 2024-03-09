import {Store, save, get} from "/js/local-store.js"
import {Filter, Search, GetUserRequest} from "/js/endpoints/request.js";

export async function login(credentials) {

    const response = await fetch(
        '/users/login/', 
        addToken(addBody(credentials, {method: "POST"}))
    );

    const json = await response.json();
    
    if(response.status != 201) handleError(json, response); 

    const token = json.token;
    save(Store.TOKEN, token);

    const user = await getUser(new GetUserRequest(json.userID));
    save(Store.USER, user);
}

export async function getUser(request) {
    const userID = request.userID;
    const response = await fetch(
        '/users/'+userID+'/', 
        addToken({method: "GET"})
    );

    const json = await response.json();
    if(response.status !== 200) return undefined
    else return json
}

// export async function validateToken(token) {
//     const token_table = getTable(Table.TOKEN);
//     const db_token = findByColumn(token_table, "token", token.token);
//     if(db_token === null || db_token.userID !== token.userID) {
//         localStorage.removeItem(Store.TOKEN);
//         throw "Not Valid";
//     }
//     save(Store.TOKEN, db_token);

//     const user_table = getTable(Table.USER);
//     const user = findByColumn(user_table, "userID", token.userID);
//     save(Store.USER, user);
// }

export async function createUser(userDetails) {
    const response = await fetch(
        '/users/create/', 
        addToken(addBody(userDetails, {method: "POST"}))
    );

    const json = await response.json();
    
    if(response.status != 201) handleError(json, response); 

    const token = token.token;
    save(Store.TOKEN, token.token);

    const user = await getUser(new GetUserRequest(json.userID));
    save(Store.USER, user);
}

export async function logout() {
    const response = await fetch(
        '/users/login/', 
        addToken({method: "POST"})
    );
    
    if(response.status != 204) {
        const json = await response.json();
        handleError(json, response); 
    }

    localStorage.removeItem(Store.TOKEN);
    localStorage.removeItem(Store.USER);

}

export function edit_user_picture(url) {
    const userID = get(Store.TOKEN).userID;
    const user_table = getTable(Table.USER);
    const index = user_table.map((t)=>t.userID).indexOf(userID);
    user_table[index].profile = url;
    safeTable(Table.USER, user_table);
    const user = user_table[index];
    save(Store.USER, user);
}

export function edit_user_bio(bio) {
    const userID = get(Store.TOKEN).userID;
    const user_table = getTable(Table.USER);
    const index = user_table.map((t)=>t.userID).indexOf(userID);
    user_table[index].description = bio;
    safeTable(Table.USER, user_table);
    const user = user_table[index];
    save(Store.USER, user);
}

export function get_room_stats(room_id) {
    const room_table = getTable(Table.ROOM);
    return findByColumn(room_table, "room_id", room_id);
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

const PAGE_SIZE = 9
export async function get_rooms(room_request) {
    let room_table = getTable(Table.ROOM);
    if(room_table.length == 0){
        const res = await (await fetch("/js/mocks/init-rooms.json")).json();
        safeTable(Table.ROOM, res);
        room_table = res;
    }

    if(room_request.search_param) {
        const search_type = room_request.search_type ?? Search.USER;
        switch(search_type) {
            case Search.USER:
                room_table = room_table.filter((room) => room.owner.username.toLowerCase().includes(room_request.search_param.toLowerCase()));
                break;
            case Search.ROOM:
                room_table = room_table.filter((room) => room.title.toLowerCase().includes(room_request.search_param.toLowerCase()));
                break;
        }
    }

    switch(room_request.filter_type ?? Filter.TIME_STAMP) {
        case Filter.TIME_STAMP:
            room_table.sort((a,b)=>b.time_stamp-a.time_stamp);
            break;
        case Filter.POPULARITY:
            shuffle(room_table);
            break;
    }

    let page = room_request.page ?? 0;
    const total = Math.ceil(room_table.length / PAGE_SIZE);
    const rooms = room_table.splice(PAGE_SIZE*page, PAGE_SIZE*page + PAGE_SIZE);

    return {
        rooms: rooms,
        num: page,
        total: total
    }    
}

export function create_room(create_room_request) {
    const user = get(Store.USER);
    const room = {
        room_id: crypto.randomUUID(),
        title: create_room_request.title,
        description: create_room_request.description,
        time_stamp: Date.now(),
        owner: user,
    }

    const room_table = getTable(Table.ROOM);
    room_table.push(room);
    safeTable(Table.ROOM, room_table);

    return room.room_id;
}


function addToken(options) {
    const token = get(Store.TOKEN);
    if(token) {
        if (options == null) options = {}
        if(options.headers) options.headers["token"] = token;
    }
    return options;
}

function addBody(body, options) {
    options.body = JSON.stringify(body);
    return options;
}

function handleError(err, res) {
    error = {
        status: res.status,
        response: res,
        message: err.error
    };
    console.log(error);
    throw error;
}