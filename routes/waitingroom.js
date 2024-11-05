const web = require("express");
const app = web.Router();

// why did i do a seprate file for this

app.get("/waitingroom/api/waitingroom", (req, res) => res.sendStatus(204));

module.exports = app;
