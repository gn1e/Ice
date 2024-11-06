const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const { UpdateTokens } = require("../utils/utils.js");
const { createError } = require("../utils/errors.js");

async function verifyToken(req, res, next) {
    const authErrorResponse = () => createError(
        "errors.com.epicgames.common.authorization.failed",
        `Authorization failed for ${req.originalUrl}`,
        [req.originalUrl], 1032, undefined, 401, res
    );

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("bearer eg1~")) return authErrorResponse();

    const token = authHeader.slice("bearer eg1~".length);

    try {
        const decodedToken = jwt.decode(token);
        const validToken = global.accessTokens.some(i => i.token === `eg1~${token}`);
        if (!validToken) throw new Error("Invalid token.");

        const expirationDate = addHours(new Date(decodedToken.creation_date), decodedToken.hours_expire);
        if (expirationDate <= new Date()) throw new Error("Expired access token.");

        req.user = await User.findOne({ accountId: decodedToken.sub }).lean();
        if (req.user.banned) return createError(
            "errors.com.epicgames.account.banned",
            "You have been banned from Fortnite.",
            [], -1, undefined, 400, res
        );

        next();
    } catch {
        removeToken(global.accessTokens, token);
        UpdateTokens();
        return authErrorResponse();
    }
}

async function verifyClient(req, res, next) {
    const authErrorResponse = () => createError(
        "errors.com.epicgames.common.authorization.failed",
        `Authorization failed for ${req.originalUrl}`,
        [req.originalUrl], 1032, undefined, 401, res
    );

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("bearer eg1~")) return authErrorResponse();

    const token = authHeader.slice("bearer eg1~".length);

    try {
        const decodedToken = jwt.decode(token);
        const validToken = global.accessTokens.some(i => i.token === `eg1~${token}`) ||
                           global.clientTokens.some(i => i.token === `eg1~${token}`);
        if (!validToken) throw new Error("Invalid token.");

        const expirationDate = addHours(new Date(decodedToken.creation_date), decodedToken.hours_expire);
        if (expirationDate <= new Date()) throw new Error("Expired access/client token.");

        if (global.accessTokens.some(i => i.token === `eg1~${token}`)) {
            req.user = await User.findOne({ accountId: decodedToken.sub }).lean();
            if (req.user.banned) return createError(
                "errors.com.epicgames.account.banned",
                "You have been permanently banned from Fortnite.",
                [], -1, undefined, 400, res
            );
        }

        next();
    } catch {
        removeToken(global.accessTokens, token);
        removeToken(global.clientTokens, token);
        UpdateTokens();
        return authErrorResponse();
    }
}

function addHours(date, hours) {
    return new Date(date.setHours(date.getHours() + hours));
}

function removeToken(tokenArray, token) {
    const index = tokenArray.findIndex(i => i.token === `eg1~${token}`);
    if (index !== -1) tokenArray.splice(index, 1);
}

module.exports = {
    verifyToken,
    verifyClient
};
