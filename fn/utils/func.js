const uuid = require("uuid");
const tokenStorage = require('../token/tokenStorage.js');

function MakeID() {
    return uuid.v4();
}

function DecodeBase64(str) {
    return Buffer.from(str, 'base64').toString();
}

function UpdateTokens() {
    const tokens = {
        accessTokens: global.accessTokens,
        refreshTokens: global.refreshTokens,
        clientTokens: global.clientTokens
    };

    tokenStorage.saveTokens(tokens);
}

module.exports = {
    MakeID,
    DecodeBase64,
    UpdateTokens
}