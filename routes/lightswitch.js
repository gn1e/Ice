const web = require("express");
const dotenv = require("dotenv");
const app = web.Router();
dotenv.config();

const banip = process.env.BANNED_IPS ? process.env.BANNED_IPS.split(",") : [];

const status1 = {
  serviceInstanceId: "fortnite",
  status: "UP",
  message: "Fortnite is online",
  maintenanceUri: null,
  overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
  allowedActions: [],
  banned: false,
  launcherInfoDTO: {
    appName: "Fortnite",
    catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
    namespace: "fn"
  }
};

const status2 = [
  {
    serviceInstanceId: "fortnite",
    status: "UP",
    message: "Fortnite is up.",
    maintenanceUri: null,
    overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
    allowedActions: ["PLAY", "DOWNLOAD"],
    banned: false,
    launcherInfoDTO: {
      appName: "Fortnite",
      catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
      namespace: "fn"
    }
  }
];

app.use((req, res, next) => {
  const userip = req.ip.replace(/^::ffff:/, '');

  if (banip.includes(userip)) {
    const bannedStatus1 = {
      ...status1,
      status: "DOWN",
      message: "Fortnite is offline",
      allowedActions: [],
      banned: true
    };

    const bannedStatus2 = status2.map(status => ({
      ...status,
      status: "DOWN",
      message: "fortnite is down.",
      allowedActions: [],
      banned: true
    }));
    if (req.path === "/lightswitch/api/service/Fortnite/status") {
      return res.json(bannedStatus1);
    } else if (req.path === "/lightswitch/api/service/bulk/status") {
      return res.json(bannedStatus2);
    }
  }
  next();
});

app.get("/lightswitch/api/service/Fortnite/status", (req, res) => {
  res.json(status1);
});

app.get("/lightswitch/api/service/bulk/status", (req, res) => {
  res.json(status2);
});

module.exports = app;
