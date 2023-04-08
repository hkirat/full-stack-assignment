const { validationResult } = require("express-validator");
const ADMINS = require("../models/Admin");
const bcrypt = require("bcrypt");
const { v1 } = require("uuid");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if admin already exists
  const existingAdmin = ADMINS.find((admin) => admin.email === req.body.email);
  if (existingAdmin) {
    return res
      .status(409)
      .json({ message: "Admin with this email already exists" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Add admin to ADMINS array
    ADMINS.push({
      id: v1(), // add unique id
      email: req.body.email,
      password: hashedPassword,
    });

    // Send success response
    res.sendStatus(201);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    // Check if admin exists in ADMINS array
    const admin = await ADMINS.find((val) => val.email === email);
    if (!admin) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate JSON Web Token (JWT)
    const payload = {
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600 });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
