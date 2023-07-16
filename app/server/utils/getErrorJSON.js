const getErrorJSON = (message, code, statusCode) => {
    return JSON.stringify({ message, code, statusCode });
}
module.exports = { getErrorJSON };