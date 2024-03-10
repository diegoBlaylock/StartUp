export class Room {
    owner_id;
    room_id;
    title;
    description;
    
    timeStamp;

    message_thread_id;
}

export class Page {
    room_ids;
    rooms;
    num;
    total;
}

export class MessageThread {
    room_id;

    message_ids;
}

export class Message {
    message_id;
    owner_id;
    content;
    timeStamp;

    message_thread_id;
}



