const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = auth;
