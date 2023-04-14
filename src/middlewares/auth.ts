import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface AuthRequest extends Request {
  userId?: string;
}

// This function will decode JWT token and add userId to req object
export function tokenDecode(req: AuthRequest, res: Response, next: NextFunction) {
  // Extract token from authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  // If token is not present then send error
  if (!token) {
    res.status(401).json({ error: "Authentication token not found." });
    return;
  }

  try {
    // Extract and add userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid access token." });
  }
}

// This function will check whether the id provided in req obj is of a admin user
export async function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  // Get userId from request object
  const userId = req.userId;

  try {
    // Get user with userId from DB
    const user = await User.findById(userId);

    // If user is not found send error
    if (!user) {
      res.status(401).json({ error: "User not found." });
      return;
    }

    // If user is not admin send error
    if (user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized access." });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
