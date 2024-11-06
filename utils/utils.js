function UpdateTokens() {
    fs.writeFileSync("./token/clientTokens.json", JSON.stringify({
        aTokens: global.aTokens,
        rTokens: global.rTokens,
        cTokens: global.cTokens
    }, null, 2));
}

module.exports = {
    UpdateTokens
}
