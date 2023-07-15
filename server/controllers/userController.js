const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const { getErrorJSON } = require("../utils/getErrorJSON");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw Error(getErrorJSON("Email and Password are Required", "MANDATORY_PARAMS", 400));
        }
        else {
            if(!validator.isEmail(email)) {
                throw Error(getErrorJSON("Email address is invalid", "INVALID_EMAIL", 400));
            }

            let user = await User.findOne({ email, password });
            if (user) {
                let { _id, name } = user;
                let jwToken = await jwt.sign({ id: _id, name }, process.env.JWT_SECRET);
                res.json({
                    token: jwToken
                });
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

const signup = async (req, res, next) => {
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
            user = await User.create({ name, email, password });
            if (user) {
                let { _id, name } = user;
                let jwToken = await jwt.sign({ id: _id, name }, process.env.JWT_SECRET);
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
module.exports = { login, signup };