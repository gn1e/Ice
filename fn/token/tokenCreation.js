const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const SECRET_KEY = process.env.JWT_SECRET

function addHours(pdate, number) {
    let date = pdate;
    date.setHours(date.getHours() + number);

    return date;
}

const createAccessToken = (user, clientId, grantType, deviceId, hoursExpire) => {
    const payload = {
        accountId: user.accountId,
        username: user.username,
        clid: clientId,
        am: grantType,
        dvid: deviceId,
        jti: uuidv4(), 
        creation_date: new Date(),
        hours_expire: hoursExpire,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: `${hoursExpire}h` });
    return token;
};

const createRefreshToken = (user, clientId, grantType, deviceId, hoursExpire) => {
    const payload = {
        accountId: user.accountId,
        clid: clientId,
        am: grantType,
        jti: uuidv4(),
        creation_date: new Date(),
        hours_expire: hoursExpire,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: `${hoursExpire}h` });
    return token;
};

const createClientToken = (clientId, ip, hoursExpire) => {
    const payload = {
        clid: clientId,
        ip: ip,
        jti: uuidv4(),
        creation_date: new Date(),
        hours_expire: hoursExpire,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: `${hoursExpire}h` });
    return { token: `eg1~${token}`, expires_in: hoursExpire * 3600 };
};

module.exports = { createAccessToken, createRefreshToken, createClientToken };
