const jwt = require('jsonwebtoken')

// Environment variables for JWT
const JWT_SECRET = process.env.JWT_SECRET || '123456789' 
const JWT_EXPIRATION = '1h' 

/**
 * Generate a JWT token for a user.
 * @param {Object} user - The user object to create the token for.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
}

module.exports = { generateToken }
