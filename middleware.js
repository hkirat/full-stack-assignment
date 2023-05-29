
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        res.status(403).json({ msg : "Missing authorization header"});
        return;
    }
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    if(decoded && decoded.email){
        req.user.email = decoded.email;
        next();
    }
    else{
        res.status(403).json({ msg : "Incorrect token"});
    }
}

module.exports = { auth };