const { ADMIN } = require("../../database");
const generateRandomString = require("../../auth");

const adminLogin = (req, res) => {
  generateRandomString();
  const { email, password } = req.body;

  if (email === "" && password === "") {
    res.status(400).send("Enter valid credentials");
  }
  if (email === "") {
    res.status(400).send("Email field is required");
  }
  if (password === "") {
    res.status(400).send("Password field is required");
  }

  ADMIN.forEach((user) => {
    if (user.email === email) {
      if (user.password == password) {
        const authToken = generateRandomString(25);
        res.status(201).json({ adminAuthToken: authToken });
      } else {
        res.status(401).send("Password does not match with email");
      }
    }
  });

  res.status(401).send("No Admin found with this email");
};

module.exports = adminLogin;
