//jwt is used to generate jwt token and verify jwt token,
// bcrypt module does 2 things: salting and hashing(hash verification as well)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const User = require("../subscriberModel");
const extractor = require("./../utils/leetcodeQuestionExtractor");
const askQuestionToGPT = require("./../utils/gptBotLeetcode");
require("dotenv").config();

//all functionality related to basic signup and login using jwt:
const signToken = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const verifyPassport = async (email, passport) => {
  const query = await User.findOne({ email: email }).select("passport");
  const match = await bcrypt.compare(passport, query.passport);
  return match;
};

const hashPassport = async (pass, saltVal = 10) => {
  const hash = await bcrypt.hash(pass, saltVal);
  return hash;
};

//protecting specific route:
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.SECRET);

  //3) if evreything is ok give control to next middleware
  req.body.email = decoded.id.email;
  next();
});

const loginControl = catchAsync(async (req, res) => {
  const { email, passport } = req.body;

  //1)check if email or passport exist:
  if (!email || !passport) {
    throw new AppError("email or passport not provided", 403);
  }
  //verify email and passport
  const match = await verifyPassport(email, passport);

  //if match==truthy,then verify token
  if (match) {
    //verify token:
    const token = await signToken(req.body);
    res.status(400).json({
      status: "success",
      token: "Bearer " + token,
    });
  } else {
    throw new AppError("Incorrect Passport", 400);
  }
});

const signupControl = catchAsync(async (req, res) => {
  const { email, passport } = req.body;

  //1)check if email or passport exist:
  if (!email || !passport) {
    throw new AppError("email or passport not provided", 403);
  }
  //2)check if passport===passport confirm:
  if (req.body.passport !== req.body.passport_confirm) {
    throw new AppError("passpord and passpord_confirm didnot match", 403);
  }
  //3)salt and generate hash to store it in database
  const hash = await hashPassport(req.body.passport, 10);

  //4)generate token for session control
  const token = await signToken(req.body);

  //5)store hashed passpord in database
  req.body.passport = hash;
  req.body.passport_confirm = hash;
  const user = new User(req.body);

  user.save().then((doc) => {
    res.status(200).json({
      status: "sucess",
      token: "Bearer " + token,
    });
  });
});
const askQuestion = catchAsync(async (req, res) => {
  //question asked by user:
  const { question } = req.body;

  // find the answer using chatgptbot:
  const answer = await askQuestionToGPT(question);

  res.status(200).json({
    status: "success",
    answer: answer,
  });
});

const myQuestions = catchAsync(async (req, res) => {
  //my email
  const { email } = req.body;

  //find all the questions from database:
  const questions = await User.findOne({ email: email }).select("questions");

  //responce all asked questions
  res.status(200).json({
    status: "success",
    question: questions.questions,
  });
});
const validateSubmission = catchAsync(async (req, res) => {
  const { email, question } = req.body;

  //find by email and get all  questions asked by me from database
  const previous = await User.findOne({ email: email });
  previous.questions.forEach((element) => {
    //if question match to previously asked question then reply yes
    if (element == question) {
      res.status(200).json({
        status: "success",
        result: "Yes you have submitted this question previously",
      });
    } else {
      //if question doesn't match to previously asked question then reply no
      res.status(201).json({
        status: "sucess",
        result: "No you have not submitted this question previously",
      });
    }
  });
});
const submitQuestion = catchAsync(async (req, res) => {
  const { email, question } = req.body;

  //find all previous questions from database:
  const previous = await User.findOne({ email: email });

  //create new updated question array:
  const updated = [];
  previous.questions.forEach((element) => {
    updated.push(element);
  });
  updated.push(question);

  //update newly created question array:
  await User.findOneAndUpdate({ email: email }, { questions: updated });

  res.status(200).json({
    status: "success",
    result: "Question updated on database",
  });
});
const convert = catchAsync(async (req, res) => {
  const { url } = req.body;
  extractor(req, res, url);
});

module.exports = {
  signupControl,
  loginControl,
  myQuestions,
  validateSubmission,
  submitQuestion,
  askQuestion,
  signToken,
  protect,
  convert,
};
