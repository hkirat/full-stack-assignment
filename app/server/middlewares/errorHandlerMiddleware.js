require("dotenv").config();
const errorHandlerMiddleware = (e, req, res, next) => {
    try {
        let { message, code, statusCode } = JSON.parse(e.message);
        res.status(statusCode || 500).json({
            success: false,
            error: { message, code },
            stack: process.env.NODE_ENV == "DEV"? e.stack:null
        });
    }
    catch(error) {
        res.status(500).json({
            success: false,
            error: { message: "Server Error", code: 500 },
            stack: process.env.NODE_ENV == "DEV"? e.stack:null
        });
    }
}
module.exports = errorHandlerMiddleware;