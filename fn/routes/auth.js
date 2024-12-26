const express = require("express");
const app = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const error = require("../utils/errors.js");
const functions = require("../utils/func.js");
const tokenCreation = require("../token/tokenCreation.js");
const { verifyToken, verifyClient } = require("../token/tokenVerify.js");
const User = require("../model/user.js");

const TOKEN_PREFIX = "eg1~";
const ACCESS_TOKEN_EXPIRY_HOURS = 8;
const REFRESH_TOKEN_EXPIRY_HOURS = 24;
const CLIENT_TOKEN_EXPIRY_HOURS = 4;

function handleError(type, message, args, code, errorType, status, res) {
    return error.createError(type, message, args, code, errorType, status, res);
}

function calculateExpiry(decodedToken, hoursExpire) {
    const expiryDate = DateAddHours(new Date(decodedToken.creation_date), hoursExpire);
    return {
        expires_in: Math.round((expiryDate.getTime() - new Date().getTime()) / 1000),
        expires_at: expiryDate.toISOString(),
    };
}

function DateAddHours(date, hours) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}

app.post("/account/api/oauth/token", async (req, res) => {
    let clientId;
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) throw new Error("Missing Authorization header");
        clientId = functions.DecodeBase64(authHeader.split(" ")[1]).split(":");
        if (!clientId[1]) throw new Error("Invalid client ID");
        clientId = clientId[0];
    } catch {
        return handleError(
            "errors.com.epicgames.common.oauth.invalid_client",
            "Invalid or missing Authorization header.",
            [],
            1011,
            "invalid_client",
            400,
            res
        );
    }

    switch (req.body.grant_type) {
        case "client_credentials": {
            const ip = req.ip;
            global.clientTokens = global.clientTokens.filter(token => token.ip !== ip);

            const token = tokenCreation.createClient(clientId, req.body.grant_type, ip, CLIENT_TOKEN_EXPIRY_HOURS);
            functions.UpdateTokens();

            const decodedClient = jwt.decode(token);
            const expiry = calculateExpiry(decodedClient, CLIENT_TOKEN_EXPIRY_HOURS);

            return res.json({
                access_token: `${TOKEN_PREFIX}${token}`,
                token_type: "bearer",
                client_id: clientId,
                internal_client: true,
                client_service: "fortnite",
                ...expiry,
            });
        }

        case "password": {
            const { username: email, password } = req.body;
            if (!email || !password) {
                return handleError(
                    "errors.com.epicgames.common.oauth.invalid_request",
                    "Username and password are required.",
                    [],
                    1013,
                    "invalid_request",
                    400,
                    res
                );
            }

            const user = await User.findOne({ email: email.toLowerCase() }).lean();
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return handleError(
                    "errors.com.epicgames.account.invalid_account_credentials",
                    "Invalid email or password.",
                    [],
                    18031,
                    "invalid_grant",
                    400,
                    res
                );
            }

            req.user = user;
            break;
        }

        case "refresh_token": {
            const { refresh_token } = req.body;
            if (!refresh_token) {
                return handleError(
                    "errors.com.epicgames.common.oauth.invalid_request",
                    "Refresh token is required.",
                    [],
                    1013,
                    "invalid_request",
                    400,
                    res
                );
            }

            const tokenIndex = global.refreshTokens.findIndex(token => token.token === refresh_token);
            if (tokenIndex === -1) {
                return handleError(
                    "errors.com.epicgames.account.auth_token.invalid_refresh_token",
                    "Invalid refresh token.",
                    [refresh_token],
                    18036,
                    "invalid_grant",
                    400,
                    res
                );
            }

            const refreshTokenData = global.refreshTokens[tokenIndex];
            const decodedToken = jwt.decode(refresh_token.replace(TOKEN_PREFIX, ""));
            const isExpired =
                DateAddHours(new Date(decodedToken.creation_date), REFRESH_TOKEN_EXPIRY_HOURS).getTime() <=
                new Date().getTime();

            if (isExpired) {
                global.refreshTokens.splice(tokenIndex, 1);
                functions.UpdateTokens();
                return handleError(
                    "errors.com.epicgames.account.auth_token.invalid_refresh_token",
                    "Expired refresh token.",
                    [],
                    18036,
                    "invalid_grant",
                    400,
                    res
                );
            }

            req.user = await User.findOne({ accountId: refreshTokenData.accountId }).lean();
            break;
        }

        default:
            return handleError(
                "errors.com.epicgames.common.oauth.unsupported_grant_type",
                `Unsupported grant type: ${req.body.grant_type}`,
                [],
                1016,
                "unsupported_grant_type",
                400,
                res
            );
    }

    const { accountId, username } = req.user;
    const deviceId = functions.MakeID().replace(/-/g, "");
    const accessToken = tokenCreation.createAccess(req.user, clientId, req.body.grant_type, deviceId, ACCESS_TOKEN_EXPIRY_HOURS);
    const refreshToken = tokenCreation.createRefresh(req.user, clientId, req.body.grant_type, deviceId, REFRESH_TOKEN_EXPIRY_HOURS);

    functions.UpdateTokens();

    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    const accessExpiry = calculateExpiry(decodedAccess, ACCESS_TOKEN_EXPIRY_HOURS);
    const refreshExpiry = calculateExpiry(decodedRefresh, REFRESH_TOKEN_EXPIRY_HOURS);

    res.json({
        access_token: `${TOKEN_PREFIX}${accessToken}`,
        refresh_token: `${TOKEN_PREFIX}${refreshToken}`,
        token_type: "bearer",
        account_id: accountId,
        client_id: clientId,
        displayName: username,
        device_id: deviceId,
        ...accessExpiry,
        refresh_expires: refreshExpiry.expires_in,
        refresh_expires_at: refreshExpiry.expires_at,
    });
});

// lawin code because atp i cba to do this backend

app.delete("/account/api/oauth/sessions/kill", (req, res) => {
    res.status(204).end();
});

app.post("/datarouter/api/v1/public/data", (req, res) => {
    res.status(204);
    res.end();
});

app.post("/auth/v1/oauth/token", async (req, res) => {
    res.json({
        access_token: "r6jtjrtjarj",
        token_type: "bearer",
        expires_at: "9999-12-31T23:59:59.999Z",
        features: [
            "AntiCheat",
            "Connect",
            "Ecom"
        ],
        organization_id: "rmajksyyajnryyrj",
        product_id: "prod-fn",
        sandbox_id: "fn",
        deployment_id: "hrtgdhrgfhfghfg",
        expires_in: 3599
    });
})

app.delete("/account/api/oauth/sessions/kill/:token", (req, res) => {
    let token = req.params.token;

    let accessIndex = global.accessTokens.findIndex(i => i.token == token);

    if (accessIndex != -1) {
        let object = global.accessTokens[accessIndex];

        global.accessTokens.splice(accessIndex, 1);

        let xmppClient = global.Clients.find(i => i.token == object.token);
        if (xmppClient) xmppClient.client.close();

        let refreshIndex = global.refreshTokens.findIndex(i => i.accountId == object.accountId);
        if (refreshIndex != -1) global.refreshTokens.splice(refreshIndex, 1);
    }
    
    let clientIndex = global.clientTokens.findIndex(i => i.token == token);
    if (clientIndex != -1) global.clientTokens.splice(clientIndex, 1);

    if (accessIndex != -1 || clientIndex != -1) functions.UpdateTokens();

    res.status(204).end();
});


app.get("/account/api/oauth/verify", verifyToken, (req, res) => {
    let token = req.headers["authorization"].replace("bearer ", "");
    const decodedToken = jwt.decode(token.replace("eg1~", ""));

    res.json({
        token: token,
        session_id: decodedToken.jti,
        token_type: "bearer",
        client_id: decodedToken.clid,
        internal_client: true,
        client_service: "fortnite",
        account_id: req.user.accountId,
        expires_in: Math.round(((DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime()) - (new Date().getTime())) / 1000),
        expires_at: DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).toISOString(),
        auth_method: decodedToken.am,
        display_name: req.user.username,
        app: "fortnite",
        in_app_id: req.user.accountId,
        device_id: decodedToken.dvid
    });
});


module.exports = app;
