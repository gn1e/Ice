fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
  const routePath = path.join(__dirname, "routes", file);
  const route = require(routePath);

  app.use(route);
  log.route(`Loaded ${file}!`)
});
