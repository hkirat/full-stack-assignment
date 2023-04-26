const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");
const app = express();
const port = 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean(),
});

const testCasesSchema = Joi.object().keys({
  input: Joi.array().required(),
  output: Joi.string().required(),
});

const questionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  testCases: Joi.array().items(testCasesSchema).required(),
});

const submissionSchema = Joi.object({
  code: Joi.string().required(),
});

class User {
  constructor(email, password, isAdmin) {
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

function mapUserFromRequest(requestBody) {
  return new User(requestBody.email, requestBody.password, requestBody.isAdmin);
}

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = mapUserFromRequest(value);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const found = USERS.some((data) => data.email === user.email);
  let message = "Succesfully Signed Up";

  if (found) {
    message = "User Already Exists!";
  } else {
    USERS.push({
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin || false,
    });
  }

  console.log(USERS);

  // return back 200 status code to the client
  res.status(200).send(message);
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = mapUserFromRequest(value);

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const found = USERS.some(
    (data) => data.email === user.email && data.password === user.password
  );

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if (found) {
    let token = (Math.random() + 1).toString(36).substring(7);
    res.status(200).send(token);
  }
  // If the password is not the same, return back 401 status code to the client
  else {
    res.status(401).send("Email or Password is Incorrect!");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const { error, value } = submissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const answer = ["accepted", "rejected"];

  const isAccepted = answer[Math.floor(Math.random() * 1)];

  SUBMISSION.push({
    code: value.code,
    isAccepted,
  });

  res.send(isAccepted);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", function (req, res) {
  const { error, value } = userSchema.validate(req.body.user);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = mapUserFromRequest(value);

  const foundAndAdmin = USERS.some(
    (data) =>
      data.email === user.email &&
      data.password === user.password &&
      data.isAdmin === true
  );

  if (foundAndAdmin) {
    const { error, value } = questionSchema.validate(req.body.question);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    QUESTIONS.push({
      title: value.title,
      description: value.description,
      testCases: value.testCases,
    });

    res.status(200).send("Question successfully added");
  } else {
    res.status(401).send("You don't have permission to add questions.");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
