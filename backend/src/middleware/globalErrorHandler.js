// src/middleware/globalErrorHandler.js
const logger  =require( '../util/logger.js')

const globalErrorHandler = (err, req, res) => {
    logger.error('Unhandled error:', err)
    res.status(500).json({ message: 'Internal Server Error' })
}

module.exports =  globalErrorHandler
