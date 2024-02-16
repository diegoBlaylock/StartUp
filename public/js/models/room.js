export class Room {
    owner_id;
    room_id;
    title;
    description;
    
    time_stamp;

    message_thread_id;
}

export class Page {
    room_ids;
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
    time_stamp;

    message_thread_id;
}



