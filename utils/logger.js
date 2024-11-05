function backend() {
    let msg = "";
    for (let i in backend.arguments) {
        msg += `${i == "0" ? "" : " "}${backend.arguments[i]}`;
    }
    console.log(`\x1b[32m[BACKEND]\x1b[0m ${msg}`);
}

function route() {
    let msg = "";
    for (let i in route.arguments) {
        msg += `${i == "0" ? "" : " "}${route.arguments[i]}`;
    }
    console.log(`\x1b[33m[ROUTE]\x1b[0m ${msg}`);
}

function exploit() {
    let msg = "";
    for (let i in exploit.arguments) {
        msg += `${i == "0" ? "" : " "}${exploit.arguments[i]}`;
    }
    console.log(`\x1b[34m[EXPLOIT]\x1b[0m ${msg}`);
}

function shop() {
    let msg = "";
    for (let i in shop.arguments) {
        msg += `${i == "0" ? "" : " "}${shop.arguments[i]}`;
    }
    console.log(`\x1b[35m[SHOP]\x1b[0m ${msg}`);
}

module.exports = {
    backend,
    route,
    exploit,
    shop
}