const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {
    const token = req.headers['authorisation'];
    
    if(!token)
        return res.status(403).json({msg:"token is missing"});
    
    const decoded = jwt.verify(token, 'SECRET_KEY');

    if(!decoded)
        return res.status(403).json({msg:"Incorrect Token"});
    else{
        req.userId = decoded.userId;
        next();
    }
    
}

const checkRole = (req,res,next) => {
    const role = req.headers['role'];
    if(role == "User")
        return res.status(403).json({msg:"You do not have permission to add the problems"});
    next();
}


module.exports = {
    auth,
    checkRole,
}