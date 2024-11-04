const web = require("express");
const app = web.Router();
const contentpages = require("../responses/contentpages.json");

app.get("/content/api/pages/*", (req, res) => {
  res.json(contentpages);
});

module.exports = app;
