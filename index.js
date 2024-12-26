const web = require("express");
const fs = require("fs");
const path = require("path");
const log = require("./fn/utils/logger.js");
const database = require("./fn/utils/database.js");
require("dotenv").config(); 

const app = web();

fs.readdirSync(path.join(__dirname, "fn", "routes")).forEach((file) => {
  const routePath = path.join(__dirname, "fn", "routes", file);
  const route = require(routePath);

  app.use(route);
  log.route(`Loaded ${file}!`)
});
(async () => { await database();})();

app.listen(process.env.PORT, () => {
  log.backend(`Ice is running on port ${process.env.PORT}!`);
  require('./fn/utils/autorotate.js');
});
