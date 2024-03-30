export const Store = Object.freeze({
    USER: "user"
});



export function get(name) {
    const item = sessionStorage.getItem(name);
    if(item == null) return item;
    return JSON.parse(item);
}

export function save(name, obj) {
    sessionStorage.setItem(name, JSON.stringify(obj));
}

export function remove(name) {
    sessionStorage.removeItem(name);
}
