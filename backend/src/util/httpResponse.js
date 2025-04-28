const httpResponse = (req, res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        request: {
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        }
    })
}

module.exports =  httpResponse
