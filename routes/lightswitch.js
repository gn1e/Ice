const web = require("express");
const app = web.Router();

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
        "serviceInstanceId": "fortnite",
        "status": "UP",
        "message": "fortnite is up.",
        "maintenanceUri": null,
        "overrideCatalogIds": ["a7f138b2e51945ffbfdacc1af0541053"],
        "allowedActions": ["PLAY", "DOWNLOAD"],
        "banned": false,
        "launcherInfoDTO": {
          "appName": "Fortnite",
          "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
          "namespace": "fn"
        }
      }
    ]

app.get("/lightswitch/api/service/Fortnite/status", (req, res) => {
  res.json(status1);
});

app.get("/lightswitch/api/service/bulk/status", (req, res) => {
    res.json(status2);
  });

module.exports = app;
