const  jwt  =  require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "defaultSecretKey"; 

const generateToken = ( userData) => {
  const payload = {userData };

  const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
  return token;
};
module.exports = {generateToken};
