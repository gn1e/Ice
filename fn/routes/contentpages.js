const web = require("express");
const app = web.Router();
const contentpages = require("../../static/contentpages.json");

const contentpagesxd = {
  ...contentpages,
  "battleroyalenews": {
    "news": {
      "_type": "Battle Royale News",
      "motds": [
        {
          "entryType": "Website",
          "image": "https://gn1e.co/bannerv2.png",
          "tileImage": "https://gn1e.co/bannerv2.png",
          "videoMute": false,
          "hidden": false,
          "tabTitleOverride": "Ice",
          "_type": "CommonUI Simple Message MOTD",
          "title": {
            "ar": "Welcome to the Ice backend!",
            "en": "Welcome to the Ice backend!",
            "de": "Welcome to the Ice backend!",
            "es": "Welcome to the Ice backend!",
            "es-419": "Welcome to the Ice backend!",
            "fr": "Welcome to the Ice backend!",
            "it": "Welcome to the Ice backend!",
            "ja": "Welcome to the Ice backend!",
            "ko": "Welcome to the Ice backend!",
            "pl": "Welcome to the Ice backend!",
            "pt-BR": "Welcome to the Ice backend!",
            "ru": "Welcome to the Ice backend!",
            "tr": "Welcome to the Ice backend!"
          },
          "body": {
            "ar": "Developed by nade!\n.gg/junglefn",
            "en": "Developed by nade!\n.gg/junglefn",
            "de": "Developed by nade!\n.gg/junglefn",
            "es": "Developed by nade!\n.gg/junglefn",
            "es-419": "Developed by nade!\n.gg/junglefn",
            "fr": "Developed by nade!\n.gg/junglefn",
            "it": "Developed by nade!\n.gg/junglefn",
            "ja": "Developed by nade!\n.gg/junglefn",
            "ko": "Developed by nade!\n.gg/junglefn",
            "pl": "Developed by nade!\n.gg/junglefn",
            "pt-BR": "Developed by nade!\n.gg/junglefn",
            "ru": "Developed by nade!\n.gg/junglefn",
            "tr": "Developed by nade!\n.gg/junglefn"
          },
          "offerAction": "ShowOfferDetails",
          "videoLoop": false,
          "videoStreamingEnabled": false,
          "sortingPriority": 90,
          "websiteButtonText": "Github",
          "websiteURL": "https://github.com/gn1e/Ice",
          "id": "61fb3dd8-f23d-45cc-9058-058ab223ba5c",
          "videoAutoplay": false,
          "videoFullscreen": false,
          "spotlight": true
        }
      ],
      "messages": [
        {
          "image": "https://gn1e.co/IceBanner.png",
          "hidden": false,
          "_type": "CommonUI Simple Message Base",
          "adspace": "ICE!",
          "title": "Welcome to the Ice backend!",
          "body": "Developed by nade!\n.gg/junglefn",
          "spotlight": false
        },
        {
          "image": "https://gn1e.co/reporting.jpg",
          "hidden": false,
          "_type": "CommonUI Simple Message Base",
          "adspace": "REPORTING!",
          "title": "In-Game Reporting!",
          "body": "Report players with the In-Game Reporting system and stop cheaters! Every report is closely investigated to make sure no one get false banned!",
          "spotlight": false
        }
      ]
    },
    "_title": "battleroyalenews",
    "header": "",
    "style": "Normal",
    "_noIndex": false,
    "alwaysShow": false,
    "_activeDate": "2024-10-12T08:19:38.427798Z",
    "lastModified": "2024-10-12T08:19:38.427798Z",
    "_locale": "en-US"
  }
};

app.get("/content/api/pages/*", (req, res) => {
  res.json(contentpagesxd);
});

module.exports = app;
