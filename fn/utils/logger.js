function backend() {
    let msg = "";
    for (let i in backend.arguments) {
        msg += `${i == "0" ? "" : " "}${backend.arguments[i]}`;
    }
    console.log(`\x1b[38;2;0;255;127m[BACKEND]\x1b[0m ${msg}`); 
}

function api() {
    let msg = "";
    for (let i in api.arguments) {
        msg += `${i == "0" ? "" : " "}${api.arguments[i]}`;
    }
    console.log(`\x1b[38;2;0;191;255m[API]\x1b[0m ${msg}`); 
}

function route() {
    let msg = "";
    for (let i in route.arguments) {
        msg += `${i == "0" ? "" : " "}${route.arguments[i]}`;
    }
    console.log(`\x1b[38;2;255;165;0m[ROUTE]\x1b[0m ${msg}`); 
}

function exploit() {
    let msg = "";
    for (let i in exploit.arguments) {
        msg += `${i == "0" ? "" : " "}${exploit.arguments[i]}`;
    }
    console.log(`\x1b[38;2;75;0;130m[EXPLOIT]\x1b[0m ${msg}`); 
}

function shop() {
    let msg = "";
    for (let i in shop.arguments) {
        msg += `${i == "0" ? "" : " "}${shop.arguments[i]}`;
    }
    console.log(`\x1b[38;2;255;105;180m[SHOP]\x1b[0m ${msg}`); 
}

function error() {
    let msg = "";
    for (let i in error.arguments) {
        msg += `${i == "0" ? "" : " "}${error.arguments[i]}`;
    }
    console.log(`\x1b[38;2;255;0;0m[ERROR]\x1b[0m ${msg}`); 
}

function warning() {
    let msg = "";
    for (let i in warning.arguments) {
        msg += `${i == "0" ? "" : " "}${warning.arguments[i]}`;
    }
    console.log(`\x1b[38;2;255;215;0m[WARNING]\x1b[0m ${msg}`); 
}

function discord() {
    let msg = "";
    for (let i in discord.arguments) {
        msg += `${i == "0" ? "" : " "}${discord.arguments[i]}`;
    }
    console.log(`\x1b[38;2;114;137;218m[BOT]\x1b[0m ${msg}`); 
}

function mongo() {
    let msg = "";
    for (let i in mongo.arguments) {
        msg += `${i == "0" ? "" : " "}${mongo.arguments[i]}`;
    }
    console.log(`\x1b[38;2;34;139;34m[MONGO]\x1b[0m ${msg}`);
}

module.exports = {
    backend,
    api,
    route,
    exploit,
    shop,
    error,
    warning,
    discord,
    mongo,
};