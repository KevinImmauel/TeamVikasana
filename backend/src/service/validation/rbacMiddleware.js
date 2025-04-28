const  jwt = require( "jsonwebtoken");
const { JWT_SECRET } = require('../../config/config');
const  User =require( "../../model/userModel");
const logger = require("../../util/logger");

const roleBasedMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    logger.info(token);

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userData.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied for your role" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};
module.exports =   roleBasedMiddleware;
