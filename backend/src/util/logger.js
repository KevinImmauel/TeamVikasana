const winston = require('winston')
const EApplicationEnvironment = require('../constant/application.js')
const dotenv = require('dotenv')

dotenv.config() // Load environment variables from .env file

// Destructure format from winston
const { format } = winston

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: '../../logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: '../../logs/combined.log' })
    ]
})

// Check environment using EApplicationEnvironment
if (process.env.NODE_ENV === EApplicationEnvironment.DEVELOPMENT) {
    // Add console transport for development
    logger.add(
        new winston.transports.Console({
            format: format.combine(format.colorize(), format.simple())
        })
    )
} 
// else if (process.env.NODE_ENV === EApplicationEnvironment.PRODUCTION) {
//     // Add MongoDB transport for production
//     logger.add(
//         new winston.transports.MongoDB({
//             level: 'info',
//             db: process.env.MONGO_URI, // MongoDB connection URI
//             collection: 'logs', // MongoDB collection for logs
//             options: {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             },
//             format: format.combine(format.timestamp(), format.json())
//         })
//     )
// }

module.exports = logger
