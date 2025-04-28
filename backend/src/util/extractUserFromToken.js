const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const extractUserFromToken = (req) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userData;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

module.exports = { extractUserFromToken };
