const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
const authenticationMiddleware = async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if(authorization && authorization.startsWith("Bearer")) {
            const jwToken = authorization.split(" ")[1];
            const data = jwt.verify(jwToken, process.env.JWT_SECRET);
            const { id } = data;
            const user = await User.findById(id);
            if(!user) {
                throw Error("Invalid Token");
            }
            req.body = { ...req.body, userId: id };
            if(user.roles.includes('admin')) {
                req.body = { ...req.body, admin: true };    
            }
            next();
        }
        else {
            throw Error("Invalid Token");
        }
    }
    catch(e) {
        throw Error("Bearer Token invalid or missing");
    }
}
module.exports = authenticationMiddleware;