const { generateAuthToken } = require("../utils/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");

async function loginHandler(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are mandatory" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "Invalid email" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const authToken = generateAuthToken(user.id);

    res.status(200).header("Authorization", `Bearer ${authToken}`).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

module.exports = loginHandler;
