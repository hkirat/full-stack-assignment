import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
dotenv.config();
const errorHandlerMiddleware = (e: Error, req: Request, res: Response, next: NextFunction) => {
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
export default errorHandlerMiddleware;