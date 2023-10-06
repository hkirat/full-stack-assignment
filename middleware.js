const JWT_SECRET = 'secret';
const jwt = require('jsonwebtoken');

module.exports = {
  auth: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        return res.status(403).json({ msg: 'Missing auth header' });
      }

      jwt.verify(authHeader, JWT_SECRET, (error, decoded) => {
        if (error) {
          console.error('JWT Verification Error:', error);
          return res.status(403).json({ msg: 'Invalid token' });
        }

        if (decoded && decoded.id) {
          req.userId = decoded.id;
          next();
        } else {
          return res.status(403).json({ msg: 'Incorrect token' });
        }
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  },
};
