const express = require('express');
const app = express();
const PORT = 6969;
const Logger = ('../utils/logger.js');

fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
  const routePath = path.join(__dirname, "routes", file);
  const route = require(routePath);

  app.use(route);
  log.route(`Loaded route: ${file}!`)
});

app.listen(PORT, () => {
  log.api(`Server is running on http://127.0.0.1:${PORT}`);
});
