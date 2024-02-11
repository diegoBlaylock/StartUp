export const Store = Object.freeze({
    TOKEN: "token",
    USER: "user"
});

function get(name) {
    localStorage.getItem(name);
}

function save(name, obj) {
    localStorage.setItem(name, obj);
}
