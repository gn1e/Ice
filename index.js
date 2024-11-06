const web = require("express");
const fs = require("fs");
const path = require("path");
const log = require("./utils/logger.js");
require("dotenv").config(); 

const app = web();
const PORT = process.env.PORT;

fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
  const routePath = path.join(__dirname, "routes", file);
  const route = require(routePath);

  app.use(route);
  log.route(`Loaded ${file}!`)
});

app.listen(PORT, () => {
  log.backend(`Ice is running on port ${PORT}!`);
  require('./utils/autorotate.js');
});

if (process.env.UseSite === true) {
  log.website(`Website Is Running on port ${WebsitePort}`);
  require('./Web/site.js');
}
