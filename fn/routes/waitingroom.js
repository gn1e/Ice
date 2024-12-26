const express = require("express");
const app = express.Router();

app.get("/waitingroom/api/waitingroom", (req, res) => {
    res.sendStatus(204);
});

module.exports = app;
