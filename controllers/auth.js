const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");

const USERS = [
  {
    email: "sumana@gmail.com",
    password: "123456",
  },
];

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  const newObj = {
    email: email,
    password: password,
  };

  const existuser = USERS.find((user) => user.email === email);

  if (existuser) return res.send("user already exists");

  USERS.push(newObj);
  return res.status(200).send("user created successfully");
};
exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  // const newObj = {
  //     email: email,
  //     password: password
  // }

  const existuser = USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (existuser) {
    //create token
    const token = jwt.sign({ email }, process.env.SECRET);
    return res.status(200).json({
      token,
      user: email,
    });
  }

  return res.status(401).json({
    error: "Email and password do not match",
  });
};

// exports.signout = (req, res)=>{
//     res.send("user signout")
// }
