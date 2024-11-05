const web = require("express");
const app = web.Router();

app.get("/waitingroom/api/waitingroom", (req, res) => res.sendStatus(204));

module.exports = app;
