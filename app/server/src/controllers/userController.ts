import User from '../models/UserModel';
import jsonwebtoken from 'jsonwebtoken';
import validator from 'validator';
import getErrorJSON from '../utils/getErrorJSON';
import getHashedPassword from '../utils/getHashedPassword';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw Error(getErrorJSON("Email and Password are Required", "MANDATORY_PARAMS", 400));
        }
        else {
            if(!validator.isEmail(email)) {
                throw Error(getErrorJSON("Email address is invalid", "INVALID_EMAIL", 400));
            }
            let user = await User.findOne({ email });
            if (user) {
                if(await bcrypt.compare(password, user.password)) {
                    let { _id, name } = user;
                    let jwToken = await jsonwebtoken.sign({ id: _id, name }, process.env.JWT_SECRET!);
                    res.json({
                        token: jwToken
                    });
                }
                else {
                    throw Error(getErrorJSON("Email or Password Invalid", "LOGIN_FAILED", 401));
                }
            }
            else {
                throw Error(getErrorJSON("Email or Password Invalid", "LOGIN_FAILED", 401));
            }
        }
    }
    catch (e) {
        next(e);
    }
}
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw Error(getErrorJSON("Name, Email and Password are Required", "MANDATORY_PARAMS", 400));
        }
        else {
            if(!validator.isEmail(email)) {
                throw Error(getErrorJSON("Email address is invalid", "INVALID_EMAIL", 400));
            }
            let user = await User.findOne({ email });
            if(user) {
                throw Error(getErrorJSON("Email address is already registered", "EMAIL_REGISTERED", 400));
            }
            const hashedPassword = await getHashedPassword(password);
            user = await User.create({ name, email, password: hashedPassword });
            if (user) {
                let { _id, name } = user;
                let jwToken = await jsonwebtoken.sign({ id: _id, name }, process.env.JWT_SECRET!);
                res.json({
                    token: jwToken
                });
            }
            else {
                throw Error(getErrorJSON("User is not Registered", "UNREGISTERED", 400));
            }
        }
    }
    catch (e) {
        next(e);
    }
}