import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import User from '../models/UserModel';
import dotenv from 'dotenv';
dotenv.config();

interface TokenData extends JwtPayload {
    id: string;
    name: string;
    iat: number;
}

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { authorization } = req.headers;
        const jwtSecret: string = process.env.JWT_SECRET!;
        if(authorization && authorization.startsWith("Bearer")) {
            const jwToken: string = authorization.split(" ")[1];
            const data = jsonwebtoken.verify(jwToken, jwtSecret) as TokenData;
            const { id } = data;
            const user = await User.findById(id);
            if(!user) {
                const error = new Error("Invalid Token");
                return next(error);
            }
            req.body = { ...req.body, userId: id };
            if(user.roles.includes('admin')) {
                req.body = { ...req.body, admin: true };    
            }
        }
        next();
    }
    catch(e) {
        const error = new Error("Bearer Token invalid or missing");
        next(error);
    }
}

export default authenticationMiddleware;