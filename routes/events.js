const web = require("express");
const app = web.Router();
require("dotenv").config(); 

const SEASON = process.env.SEASON;

// spaghetti code but yk if it works it works

const event1 = {
    "events": [
        {
            "gameId": "Fortnite",
            "eventId": "IceTournament",
            "regions": [
                "EU"
            ],
            "regionMappings": {},
            "platforms": [
                "XboxOneGDK",
                "PS4",
                "XboxOne",
                "XSX",
                "Android",
                "PS5",
                "Switch",
                "Windows"
            ],
            "platformMappings": {},
            "displayDataId": "IceTournament",
            "eventGroup": "",
            "announcementTime": "2019-01-29T08:00:00.000Z",
            "appId": null,
            "environment": null,
            "metadata": {
                "minimumAccountLevel": 0
            },
            "eventWindows": [
                {
                    "eventWindowId": "IceTournament_Event1",
                    "eventTemplateId": "EventTemplate_IceTournament",
                    "countdownBeginTime": "2021-01-01T01:00:00.000Z",
                    "beginTime": "2021-01-01T01:00:00.000Z",
                    "endTime": "9999-01-01T01:00:00.000Z",
                    "blackoutPeriods": [],
                    "round": 0,
                    "payoutDelay": 0,
                    "isTBD": false,
                    "canLiveSpectate": false,
                    "scoreLocations": [],
                    "visibility": "unlocked",
                    "requireAllTokens": [],
                    "requireAnyTokens": [],
                    "requireNoneTokensCaller": [],
                    "requireAllTokensCaller": [],
                    "requireAnyTokensCaller": [],
                    "additionalRequirements": [],
                    "teammateEligibility": "all",
                    "metadata": {
                        "ServerReplays": true,
                        "RoundType": "Qualifiers"
                    }
                }
            ],
            "beginTime": "2021-01-01T01:00:00.000Z",
            "endTime": "9999-01-01T01:00:00.000Z"
        }
    ],
    "player": {},
    "scores": [],
    "templates": [
        {
            "gameId": "Fortnite",
            "eventTemplateId": "EventTemplate_IceTournament",
            "playlistId": "Playlist_Duos",
            "matchCap": 0,
            "liveSessionAttributes": [],
            "scoringRules": []
        }
    ]
}

const event2 = {
    "result": true,
    "region": "ALL",
    "lang": "en",
    "season": `${SEASON}`,
    "events": []
}

app.get("/api/v1/events/Fortnite/download/:accountId", (req, res) => {
  res.json(event1);
});

app.get("/api/v1/players/Fortnite/tokens", (req, res) => {
    res.json({});
});
app.get("/api/v1/leaderboards/Fortnite/:eventId/:eventWindowId/:accountId", (req, res) => {
    res.json({});
});
app.get("/api/v1/events/Fortnite/data/", (req, res) => {
    res.json({});
});
app.get("/api/v1/events/Fortnite/:eventId/:eventWindowId/history/:accountId", (req, res) => {
    res.json({});
});
app.get("/api/v1/players/Fortnite/:accountId", (req, res) => {
    res.json(event2);
});

module.exports = app;
