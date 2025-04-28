const express = require('express')
const globalErrorHandler = require('./middleware/globalErrorHandler.js')
const cors = require('cors')
const helmet = require('helmet')
const responseMessage = require('./constant/responseMessage.js')
const httpError = require('./util/httpError.js')
const app = express()
const { limiter } = require('./util/apiRateLimit')
const allowedOrigins = ['http://localhost:3000',]
const authRoutes = require('./api/router/authRoutes.js')
const userInfo = require('./api/router/userDataRoutes.js')
const apiValidator = require('./service/validation/apiValidation.js')

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the incoming origin is in the list of allowed origins
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}
app.use(cors(corsOptions))
// Middleware
app.use(express.urlencoded({ extended: true })) // Parses incoming URL-encoded data
app.use(express.json())
app.use(helmet())
app.use(limiter)
app.use(apiValidator)

// API ENtry Point
// app.use('api/v1/')
app.get('/',(req,res)=>{
     res.send("You won;t be able to access any api after that")
    })


app.use('/api/v1', authRoutes)
app.use('/api/v1', userInfo )

// 404 Handler
app.use((req, _, next) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (err) {
        httpError(next, err, req, 404)
    }
})

// Global error handler
app.use(globalErrorHandler)

module.exports = app
