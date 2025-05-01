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
const sosRoutes = require('./api/router/sosRoutes')
const beatRoute = require('./api/router/beatRoutes')
const incidentRoute = require('./api/router/incidentRoutes')
const areaRoutes = require('./api/router/areaRoutes.js')
const statsRoute = require('./api/router/getCount.js')
const analyticRoute = require('./analytics/analyticRoute.js')
const getCrimeLocation = require('./api/router/crimeLocationRoutes.js')
const chatBotRoute = require('./chatbot/chatbotRoute.js')
const apiValidator = require('./service/validation/apiValidation.js')
const path = require("path");

const corsOptions = {
    origin: function (origin, callback) {
        // Allow all if origin is not present (like in curl/bots), or is in the list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Still allow unknown origins
            callback(null, true); // <- Relaxed for bots and unknowns
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}
app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true })) // Parses incoming URL-encoded data
app.use("./uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json())
app.use(helmet())
// app.use(limiter)
// app.use(apiValidator)

// API ENtry Point
// app.use('api/v1/')
app.get('/',(req,res)=>{
     res.send("You won't be able to access any api after that")
    })
app.use('/api/v1', authRoutes)
app.use('/api/v1', userInfo )
app.use('/api/v1', sosRoutes  )
app.use('/api/v1/beat', beatRoute   )
app.use('/api/v1', incidentRoute   )
app.use('/api/v1', statsRoute   )
app.use('/api/v1', chatBotRoute   )
app.use('/api/v1', getCrimeLocation )
app.use('/api/v1', analyticRoute )
app.use('/api/v1/manage/area/', areaRoutes   )

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
