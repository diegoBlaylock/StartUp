export const Store = Object.freeze({
    TOKEN: "token",
    USER: "user"
});

export function get(name) {
    return JSON.parse(localStorage.getItem(name));
}

export function save(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
}
