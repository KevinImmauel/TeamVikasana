const  dotenvFlow =require( 'dotenv-flow')


dotenvFlow.config()

// Creating a configuration module
const config = {
    ENV: process.env.ENV || 'development',
    PORT: process.env.PORT || 3000,
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
    // REDIS_URL: process.env.REDIS_URL,
    // REDIS_HOST:process.env.REDIS_HOST,
    // REDIS_PORT:process.env.REDIS_PORT,
    // REDIS_PASSWORD:process.env.REDIS_PASSWORD,
}

module.exports =  config
