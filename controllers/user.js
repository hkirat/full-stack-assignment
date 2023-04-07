const { USERS } = require("../data/userDB");

const TOKENS = {};

exports.signup = (req, res) => {
  const { email, password } = req.body;

  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).send("User with this email already exists");
  }

  USERS.push({ email, password });

  res.status(200).json(USERS);
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  if (user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  const token = Math.random().toString(36).substr(2);
  TOKENS[token] = user.email;

  res.status(200).json({ token });
};

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successfull",
  });
};
