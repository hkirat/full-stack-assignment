const { generateAuthToken } = require("../utils/auth");
const User = require("../models/user");

async function signupHandler(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are mandatory" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const authToken = generateAuthToken(newUser.id);

    res.status(201).header("Authorization", `Bearer ${authToken}`).json({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

module.exports = signupHandler;
