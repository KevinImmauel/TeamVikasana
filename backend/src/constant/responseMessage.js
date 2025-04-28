const responseMessage = {
    SUCCESS: `The operation has been successful`,
    ERROR: `An error has occurred`,
    INVALID_INPUT: `Invalid input`,
    INVALID_CREDENTIALS: `Invalid credentials`,
    USER_ALREADY_EXISTS: `User already exists`,
    USER_NOT_FOUND: `User not found`,
    INVALID_PASSWORD: `Invalid password`,
    SOMETHING_WENT_WRONG: `Something went wrong`,
    NOT_FOUND: (entity) => `${entity} not found`
}

module.exports = responseMessage 
