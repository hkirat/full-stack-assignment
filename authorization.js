import jwt from "jsonwebtoken";
export const verifyToken =  (req, res, next) => {
    try {
        let token = req.header('Authorization')
        if (!token) {
            return res.status(403).send("Access Denied");

        }
        if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length)
            
        }
        const verified = jwt.verify(token,"secret")
        req.user = verified
        req.token=token
        next()
    } catch(err) {
        res.status(500).json({error:err.message})
    }
}

export const isAdminRoute = (req, res, next) => {
    
        const getToken = req.token
        const decodedToken = jwt.verify(getToken, 'secretKey');
        const { id, isAdmin } = decodedToken;
    if (id && isAdmin) {
            next()
    } else {
        res.status(400).json({error:"Cannot create problem not admin"})
        }
    
}