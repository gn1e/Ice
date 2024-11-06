module.exports = function(websiteApp) {
    const express = require("express");
    const path = require("path");
 require("dotenv").config(); 

    const DISCORDURL = 'https://discord.com/api';
    const CLIENT_ID = process.env.Client_ID;
    const CLIENT_SECRET = process.env.Client_Secret;
    const REDIRECT_URI = proccess.env.Redirect

    websiteApp.use(express.json());
    websiteApp.use(express.urlencoded({ extended: true }));

    websiteApp.get('/login', (req, res) => {
        const authURL = `${DISCORDURL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify email`;

        res.redirect(authURL);
    });

    const oauthCallback = require('./Data/js/Callback')(DISCORD_API_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    websiteApp.get('/api/oauth/callback', oauthCallback);

    websiteApp.post('/registeruser', require('./Data/js/registerUser'));

    websiteApp.get('/clientregister', (req, res) => {
        res.sendFile(path.join(__dirname, './webdata/frontend/register.html'));
    });

    websiteApp.get('/accexists', (req, res) => {
        res.sendFile(path.join(__dirname, './webdata/frontend/accountExists.html'));
    });

    websiteApp.get('/success', (req, res) => {
        res.sendFile(path.join(__dirname, './webdata/frontend/success.html'));
    });


    websiteApp.use('/styles', express.static(path.join(__dirname, './Data/css')));
   

    websiteApp.get('/', (req, res) => {
        res.redirect('/login');
    });
    
};
