// src/config/db.js
const {mongoose} = require('mongoose')
const config = require('../config/config')
const logger = require('../util/logger')

let mainDbConnection

const urlDB = config.DATABASE_URL

const connectToDatabases = async () => {
    try {
        mainDbConnection = mongoose.createConnection(urlDB, {
            serverSelectionTimeoutMS: 30000
        })
        mainDbConnection.on('connected', () => logger.info('Connected to main MongoDB database'))
        mainDbConnection.on('error', (err) => logger.error('Error connecting to main MongoDB database:', err))

        await Promise.all([
            mainDbConnection.asPromise(),
        ])
    } catch (err) {
        logger.error('Error connecting to MongoDB databases:', err)
        throw err
    }
}

const getMainDb = () => mainDbConnection

const closeConnections = async () => {
    try {
        await mainDbConnection.close()
        logger.info('All MongoDB connections closed')
    } catch (err) {
        logger.error('Error closing MongoDB connections:', err)
    }
}

connectToDatabases().catch((err) => {
    logger.error('Failed to initialize database connections:', err)
    process.exit(1)
})

module.exports = {
    connectToDatabases,
    getMainDb,
    closeConnections
}

