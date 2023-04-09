const jwt = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET;

exports.auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(authHeader, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
};