const bcrypt = require("bcrypt");
const { USERS } = require("../../model/user.model");
const saltRounds = 10;
const userSignup = async (req, res) => {
  // Add logic to decode body
  const data = req.body;
  // body should have email and password
  if (
    !data?.email ||
    !data?.password ||
    !data.email.length === 0 ||
    data.password.length < 8
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // checking for duplication...
  if (USERS.find((user) => user.email === data.email)) {
    return res.status(400).json({ message: "user already exist!" });
  }
  // hashing password...
  await bcrypt.hash(data.password, saltRounds, (err, result) => {
    if (!err) {
      USERS.push({ ...data, password: result, isAdmin: false });

      return res
        .status(200)
        .json({ message: "signup successfully completed!" });
    } else {
      return res.status(400).json({ message: "something went wrong!" });
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
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === data.email);
  const pwd = await bcrypt.compare(data.password, user?.password || "");
  if (user && pwd) {
    return res
      .status(200)
      .json({ message: "login successful", token: "dfaoeeaf" });
  } else {
    return res.status(401).json("email or password are incorrect!");
  }
};

module.exports = { userSignin, userSignup };
