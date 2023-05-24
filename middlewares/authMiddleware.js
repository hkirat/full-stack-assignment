import { USER_ROLES } from "../models/User.js";
import { validateToken } from "../utils/authUtils.js";

const ensureAuthenticated = (req, res, next) => {
  const validToken = validateToken(req);

  if (!validToken) {
    return res.status(401).json({ error: "Not authenticated!" });
  }

  next();
};

const ensureIsAdmin = (req, res, next) => {
  if (!req?.user) {
    return res.status(401).json({ error: "Not authenticated!" });
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({ error: "Unauthorized request!" });
  }

  next();
};

export { ensureAuthenticated, ensureIsAdmin };
