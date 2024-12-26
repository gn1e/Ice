const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token.replace("eg1~", ""), SECRET_KEY);
        return decoded;
    } catch (err) {
        throw new Error("Invalid or expired token.");
    }
};

const tokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("bearer ")) {
            return res.status(401).json({ error: "Authorization header missing or invalid" });
        }

        const token = authHeader.replace("bearer ", "");
        const decoded = verifyToken(token);

        req.tokenData = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized", message: err.message });
    }
};

module.exports = { verifyToken, tokenMiddleware };
