const emailValidator = require("email-validator");
const PassowrdValidator = require("password-validator");
const passwordValidator = new PassowrdValidator();
const  USERS  = require("../database");

passwordValidator
  .is().min(8)
  .has().digits()
  .has().uppercase()
  .has().symbols()
  .has().not().spaces();

const signup = (req, res) => {

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
  if (emailValidator.validate(email) === false) {
    res.status(400).send("Email address is not valid");
  }
  if (passwordValidator.validate(password) === false) {
    res.status(400).send("Create a strong password with numbers symbols");
  }

  let isUserExist = false;
  USERS.forEach((user) => {
    if (user.email === email) {
      res.status(400).send("User already exists with this email");
      isUserExist = true;
    }
  });

  if (!isUserExist) USERS.push({ email, password });

  console.log(USERS);

  res.status(200).send("User created successfully");
};

module.exports = signup;
