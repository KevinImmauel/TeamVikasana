const responseMessage = require('../constant/responseMessage.js')
const config = require('../config/config.js')
const EApplicationEnvironment = require('../constant/application.js')

module.exports = (err, req, errorStatusCode) => {
    const errorObj = {
        success: false,
        statuscode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    console.error('CONTROLLER_ERROR', {
        meta: errorObj
    })

    // Production Check
    if (config.ENV === EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}
