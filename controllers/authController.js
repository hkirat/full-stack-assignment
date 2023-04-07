const { validationResult } = require("express-validator");
const USERS = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if user already exists
  const existingUser = USERS.find((user) => user.email === req.body.email);
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Add user to USERS array
    USERS.push({ email: req.body.email, password: hashedPassword });

    // Send success response
    res.sendStatus(201);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signin = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    // Check if user exists in USERS array
    const user = await USERS.find();
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
