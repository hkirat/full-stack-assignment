import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { generateAuthToken } from "../utils/auth";

// Interface for login request body
interface LoginRequestBody {
  email: string;
  password: string;
}

// Send backs auth-token is login is successfull
async function loginHandler(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> {
  // Get email and password from request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are mandatory" });
    return;
  }

  try {
    // Find the user by email
    const user: IUser | null = await User.findOne({ email });

    // If user not found, return error
    if (!user) {
      res.status(401).json({ error: "Invalid email" });
      return;
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, return error
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Generate JWT token
    const authToken: string = generateAuthToken(user.id);

    // Send token in response header
    res.status(200).header("Authorization", `Bearer ${authToken}`).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    // If any error send server error
    console.error((error as Error).message);
    res.status(500).send("Server Error");
  }
}

export default loginHandler;
