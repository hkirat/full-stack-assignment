const emailValidator = require("email-validator");
const PassowrdValidator = require("password-validator");
const passwordValidator = new PassowrdValidator();
const  {ADMIN}  = require("../../database");

passwordValidator
  .is().min(8)
  .has().digits()
  .has().uppercase()
  .has().symbols()
  .has().not().spaces();

const adminSignup = (req, res) => {

  const { email, password } = req.body;

  if (email === "" && password === "") {
    res.status(400).send("Email and Password are required");
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

  let isAdminExist = false;
  ADMIN.forEach((user) => {
    if (user.email === email) {
      res.status(400).send("Admin already exists with this email");
      isAdminExist = true;
    }
  });

  if (!isAdminExist) ADMIN.push({ email, password });

  console.log(ADMIN);

  res.status(200).send("Admin created successfully");
};

module.exports = adminSignup;
