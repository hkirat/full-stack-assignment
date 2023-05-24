import { USERS, USER_ROLES } from "../models/User.js";
import { generateJwtToken } from "../utils/authUtils.js";
import { generateUniqueId } from "../utils/uidUtils.js";

// Finds user by _id or email
const findUser = ({ _id = null, email = null }) => {
  const user = USERS.find((user) => {
    return user._id === _id || user.email === email;
  });

  return user;
};

const login = (req, res) => {
  try {
    const { email = null, password = null } = req.body;

    if (!(email && password)) {
      throw new Error("Please enter your email and password!");
    }

    // Authenticate User credentials
    const existingUser = findUser({ email });

    if (!existingUser) {
      throw new Error("User not found!");
    }
    if (existingUser.password !== password.trim()) {
      throw new Error("Invalid credentials!");
    }

    // Generate Token
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
    const emailInUse = findUser({ email });
    if (emailInUse) {
      throw new Error("User with this email already exists!");
    }

    // Create new user
    const newUser = {
      _id: generateUniqueId(),
      role: USER_ROLES.USER,
      name,
      email: email.toLowerCase(),
      password: password.trim(),
    };

    USERS.push(newUser);

    return res.status(201).json({ success: "Signup successful." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { login, signup };
