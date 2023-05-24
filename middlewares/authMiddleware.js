import { validateToken } from "../utils/authUtils.js";

const ensureAuthenticated = (req, res, next) => {
  const validToken = validateToken(req);

  if (!validToken) {
    return res.status(401).json({ error: "Unauthorized request!" });
  }

  next();
};

export { ensureAuthenticated };
