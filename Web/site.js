module.exports = function(websiteApp) {
    const express = require("express");
    const path = require("path");
 require("dotenv").config(); 

    const DISCORDURL = 'https://discord.com/api';
    const CLIENT_ID = process.env.Client_ID;
    const CLIENT_SECRET = process.env.Client_Secret;
    const REDIRECT_URI = proccess.env.Redirect

    websiteApp.get('/login', (req, res) => {
        const authURL = `${DISCORDURL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify email`;

        res.redirect(authURL);
    });

    const oauthCallback = require('./Data/js/Callback')(DISCORD_API_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

};
