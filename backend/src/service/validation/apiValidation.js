const jwt = require("jsonwebtoken");
const  User  =  require("../../model/userModel"); // Adjust if needed
const { JWT_SECRET } = require('../../config/config')

const apiValidator = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userData.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = apiValidator ;
