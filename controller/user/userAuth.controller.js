const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { USERS } = require("../../model/user.model");
const saltRounds = 10;

const TokenGenerator = (res, id) => {
  jwt.sign({ user: id }, process.env.SECRETKEY, (err, token) => {
    if (err) {
      return res.status(400).json({ msg: "Something went wrong!", err });
    }
    return res.status(200).json({ msg: "Loggin successful", token: token });
  });
};

const userSignup = async (req, res) => {
  // Add logic to decode body
  const data = req.body;
  // body should have email and password

  if (
    !data?.email ||
    !data?.password ||
    !data.email.length === 0 ||
    data.password.length < 6
  ) {
    return res.status(400).json({ err: "All fields are required!" });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // checking for duplication...
  if (USERS.find((user) => user.email === data.email)) {
    return res.status(400).json({ err: "user already exist!" });
  }
  // hashing password...
  await bcrypt.hash(data.password, saltRounds, (err, result) => {
    if (!err) {
      USERS.push({ ...data, password: result, isAdmin: false, id: uuidv4 });

      return res.status(200).json({ msg: "signup successfully completed!" });
    } else {
      return res.status(400).json({ err: "something went wrong!" });
    }
  });
  // storing user details in Array...

  // return back 200 status code to the client
};

const userSignin = async (req, res) => {
  // Add logic to decode body
  const data = req.body;
  // body should have email and password
  if (
    !data?.email ||
    !data?.password ||
    !data.email.length === 0 ||
    !data.password.length === 0
  ) {
    return res.status(400).json({ err: "All fields are required!" });
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === data.email);
  const pwd = await bcrypt.compare(data.password, user?.password || "");
  if (user && pwd) {
    TokenGenerator(res, user.id);
  } else {
    return res.status(401).json({ err: "email or password are incorrect!" });
  }
};

module.exports = { userSignin, userSignup };
