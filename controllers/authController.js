import { USERS } from "../models/User.js";
import { generateJwtToken } from "../utils/authUtils.js";

const login = (req, res) => {
  try {
    const { email = null, password = null } = req.body;

    if (!(email && password)) {
      throw new Error("Please enter your email and password!");
    }

    const existingUser = USERS.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password.trim()
    );

    if (!existingUser) {
      throw new Error("Invalid credentials!");
    }

    delete existingUser.password;

    const token = generateJwtToken(existingUser);

    const data = {
      user: existingUser,
      token,
    };

    return res.status(200).json({ success: "Login successful", data });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { name = null, email = null, password = null } = req.body;

    if (!(name && email && password)) {
      throw new Error("name, email and password are required!");
    }

    // Check existing users with same email
    const emailInUse = USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailInUse) {
      throw new Error("User with this email already exists!");
    }

    USERS.push({
      _id: USERS.length + 1,
      name,
      email: email.toLowerCase(),
      password: password.trim(),
    });

    return res.status(201).json({ success: "Signup successful." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { login, signup };
