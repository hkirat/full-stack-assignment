import { QUESTIONS, SUBMISSION, USERS } from "../models/datasets.js";

export const signup = (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password, userType } = req.body;

  if (USERS.find((user) => user.email === email)) {
    return res.status(404).json({
      success: false,
      message: "User Already Exist, Please Login",
    });
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({
    userid: USERS.length + 1,
    email,
    password,
    userType,
  });
  // return back 200 status code to the client
  res.status(200).json({
    success: true,
    message: "Signed In Successfully",
  });
};

export const displayAll = (req, res) => {
  res.status(200).json({
    success: true,
    USERS,
  });
};

export const login = (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  const token = user.userid;

  // If the password is not the same, return back 401 status code to the client
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Email Does not exist, Signup First",
    });
  }

  if (user.password != password || user.email != email) {
    return res.status(400).json({
      success: false,
      message: "Incorrect Email or Password",
    });
  }

  // Also ensure that the password is the same
  if (user.password == password) {
    // If the password is the same, return back 200 status code to the client
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged In Successfully",
        // Also send back a token (any random string will do for now)
        token,
      });
  }
};

export const questions = (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({
    success: true,
    QUESTIONS,
  });
};

export const getAllSubmission = (req, res) => {
  // const { qid } = req.body;
  // res.status(200).json({
  //   success: true,
  // });
};

export const postSubmisssion = (req, res) => {
  const { qid, code } = req.body;

  const token = req.cookies;
  const user = USERS.find((user) => user.userid === token);

  res.status(201).json({
    success: true,
    message: "Submitted",
  });

  SUBMISSION.push({
    userid: user.userid,
    qid,
    code,
    status: Math.random() >= 0.5 ? "Accepted" : "Wrong Answer",
  });
};

export const addQuestions = (req, res) => {
  const { title, description, testCases } = req.body;

  QUESTIONS.push({
    qid: QUESTIONS.length + 1,
    title,
    description,
    testCases,
  });

  res.status(201).json({
    success: true,
    message: "Problem Added Successfully",
  });
};
