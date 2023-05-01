const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      return res.status(401).send('Unauthorized');
    }
}
