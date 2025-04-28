// const { createClient }  = require( 'redis')
// const config = require('../config/config');
// // Set up Redis client configuration
// const redisClient = createClient({
//     url: config.REDIS_URL || 'redis://localhost:6379' // Replace with your Redis URL
// })

// // Connect to Redis and handle errors
// const connectRedis = async () => {
//     try {
//         await redisClient.connect()
//         console.log('Connected to Redis')
//     } catch (error) {
//         console.error('Redis connection error:', error)
//     }
// }

// // Handle Redis errors
// redisClient.on('error', (err) => console.error('Redis Client Error', err))

// // Export Redis client and connection function
// module.exports =  { redisClient, connectRedis }
