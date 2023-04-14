import { Request, Response } from "express";
import { generateAuthToken } from "../utils/auth";
import User, { IUser } from "../models/user";

// Interface for signup request body
interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

// Signup Handler adds a new user to the DB, only if the user doesn't exists
async function signupHandler(
  req: Request<{}, {}, SignupRequestBody>,
  res: Response
): Promise<void> {
  try {
    // Get name, email and password from request body
    const { name, email, password } = req.body;

    // Check if mandatory fields are present
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are mandatory" });
      return;
    }

    // Check if user already exists
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    // Create new user
    const newUser: IUser = new User({ name, email, password });
    await newUser.save();

    // Generate auth token
    const authToken: string = generateAuthToken(newUser.id);

    // Send JWT token as Header and send user data as json
    res.status(201).header("Authorization", `Bearer ${authToken}`).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    // If any error send server error
    console.error((error as Error).message);
    res.status(500).send("Server Error");
  }
}

export default signupHandler;
