import { validateToken } from "../utils/authUtils.js";

const ensureAuthenticated = (req, res, next) => {
  const { authorization = null } = req.headers;

  const validToken = validateToken(authorization);

  if (!validToken) {
    return res.status(401).json({ error: "Unauthorized request!" });
  }

  next();
};

export { ensureAuthenticated };
