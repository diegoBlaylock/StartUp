export const Store = Object.freeze({
    TOKEN: "token",
    USER: "user"
});



export function get(name) {
    const item = localStorage.getItem(name);
    if(item == null) return item;
    return JSON.parse(item);
}

export function save(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
}

export function remove(name) {
    localStorage.removeItem(name);
}
