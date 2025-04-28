const errorObject = require('./errorObject.js')

module.exports = (nextFunc, err, req, errorStatusCode) => {
    const errorObj = errorObject(err, req, errorStatusCode)
    nextFunc(errorObj)
}
