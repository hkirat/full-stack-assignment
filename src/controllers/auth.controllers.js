const { hash, compare } = require("bcrypt");
const { USERS } = require("../database/data");
const jwt = require("jsonwebtoken");

const secretKey = "my-secret-key";
const options = {
  expiresIn: "1h",
};

const signup = async (req, res, next) => {
  try {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("Email and password are required!");
      err.statusCode = 400;
      throw err;
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    const userExists = USERS.find((user) => user.email === email);
    if (userExists) {
      const err = new Error("User with the given email already exists!");
      err.statusCode = 400;
      throw err;
    }

    const hashedPassword = await hash(password, 10);
    const id = USERS.length;
    const payload = { id, email };
    const token = jwt.sign(payload, secretKey, options);

    USERS.push({ email, password: hashedPassword });
    // return back 200 status code to the client
    const responseData = {
      id,
      email,
      token,
    };
    res.customJson(responseData, "User created successfully!", 200);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Add logic to decode body
    // body should have email and password
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("Email and password are required!");
      err.statusCode = 400;
      throw err;
    }

    // Check if the user with the given email exists in the USERS array
    const userExists = USERS.find((user) => user.email === email);
    if (!userExists) {
      const err = new Error("User with the given email does not exist!");
      err.statusCode = 400;
      throw err;
    }

    // Also ensure that the password is the same
    const isPasswordSame = await compare(password, userExists.password);
    if (!isPasswordSame) {
      const err = new Error("Password is incorrect!");
      err.statusCode = 401;
      throw err;
    }

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    const payload = { id: userExists.id, email: userExists.email };
    const token = jwt.sign(payload, secretKey, options);
    const responseData = {
      email,
      token,
    };
    res.customJson(responseData, "User Logged In Successfuly", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
