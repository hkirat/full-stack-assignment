import { User } from "../models/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    // generating salt using bcrypt
    const salt = await bcrypt.genSalt();

    // encoding the password

    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new user Document
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      isAdmin: isAdmin || false,
    });

    //Store email and password to the database
    await newUser.save();

    // return back 200 status code to the client
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create user", error_msg: err.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given email exists in the USERS collection
    const user = await User.findOne({ email });

    if (user) {
      const isPassword = await bcrypt.compare(password, user.password);

      if (isPassword) {
        const token = jwt.sign(
          { email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY
        );

        // converting it to normal js Object
        const userObj = user.toObject();
        // deleting password before sending it to user
        delete userObj.password;

        // If the password is the same, return back 200 status code to the client
        res.status(200).json({
          message: `signIn Successful & Welcome!! ${user.username}`,
          token: token,
          user: userObj,
        });
      } else {
        throw new Error("email or password is incorrect");
      }
    } else {
      throw new Error("email is incorrect");
    }
  } catch (err) {
    res.status(500).send(`ERROR OCCURRED!!, ERROR Message: ${err.message}`);
  }
};
