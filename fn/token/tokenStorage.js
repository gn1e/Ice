let tokens = {
    accessTokens: [],
    refreshTokens: [],
    clientTokens: []
};

function loadTokens() {
    return tokens;
}

function saveTokens(newTokens) {
    tokens = newTokens; 
}

module.exports = { loadTokens, saveTokens };
