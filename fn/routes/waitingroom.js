const express = require("express");
const app = express.Router();

const maxonline = 50;
const quetime = 5 * 60 * 1000; 

let playersinque = [];

function getOnlinePlayersCount() {
    // one day
    return 0; 
}

// this is probably not proper
function yesyes() {
    if (playersinque.length > 0) {
        const { req, res } = playersinque.shift(); 
        res.sendStatus(204); 
    }
}

setInterval(yesyes, quetime);

app.get("/waitingroom/api/waitingroom", (req, res) => {
    const playeronline = getOnlinePlayersCount();

    if (playeronline >= maxonline) {
        playersinque.push({ req, res });
    } else {
        res.sendStatus(204);
    }
});

module.exports = app;
