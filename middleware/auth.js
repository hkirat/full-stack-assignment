const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateUser(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        res.json({"message": "Token not found"});
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.json({ "error": err });
        }
        else {
            req.user = user;
            next();
        }
    })
}

module.exports = authenticateUser;
