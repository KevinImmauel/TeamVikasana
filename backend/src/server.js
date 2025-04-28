const configData = require('./config/config') // Import config data
const http = require('http')
const app = require('./app')
const {logger} = require("./util/logger")
const { connectToDatabases } = require('./database/db')
const server = http.createServer(app)
const  setupSocket  = require('./websocket/websocket'); // Import WebSocket server
// initializeSOSSocket(server);
setupSocket(server);


const PORT = configData.PORT || process.env.PORT

connectToDatabases()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        logger.error('Error connecting to databases:', err) 
        process.exit(1)
    })
