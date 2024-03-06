export const Table = Object.freeze({
    USER: "user_table",
    TOKEN: "token_table",
    ROOM: "room_table",
    CREDENTIALS: "credentials",
    MESSAGE_THREAD: "message_thread_table",
    MESSAGE: "message"
});

const tables = {}

export function getTable(name) {
    const table = tables[name];
    if (table === null) return [];
    return table;
}

export function saveTable(name, table) {
    tables[name] = table;
}

export function findByColumn(table, attribute, value) {
    for(const obj of table) {
        if(obj[attribute] === value) {
            return obj;
        }
    }

    return null;
}

export function contains(table, attribute, value) {
    for(const obj of table) {
        if(obj[attribute] === value) {
            return true;
        }
    }

    return false;
}
