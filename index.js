const express = require("express");
const validator = require("validator");
const app = express();
const port = 3001;

const USERS = []; //{ email: "example@domain.com", password: "myNameIsKaran", role: "admin" }

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

const SUBMISSION = []; //{user: "example@domain.com", question:"Two states", submission:"<<the code>>"}

const AccessToken_Random_string =
  "jasfbasbhjdacuoasdnbvaufisfifvipuafafvqfn9u43fr9qvb49f8rnwfreq";

// middleware to convert body to json
app.use(express.json());

//User signup
app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, role } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  switch (true) {
    case !email || !password || !role: //check if all values are provided
      return res.status(400).json({ message: "All fields not provided" });
    case !validator.isEmail(email): //check email validity
      return res.status(400).json({ message: "Not a valid email" });
    case USERS.some((v) => v.email === email): //check if user is already registered
      return res.status(400).json({ message: "Email already registered" });
    case !validator.isStrongPassword(password): //check if password is strong
      return res.status(400).json({ message: "Not a valid password" });
    case !["admin", "user"].includes(role): //check if role is included in options
      return res
        .status(400)
        .json({ message: 'Role must be either "user" or "admin".' });
  }

  try {
    //Add user
    USERS.push({ email, password, role });
    //return success
    res.status(200).json({
      user: { email, role },
      accessToken: AccessToken_Random_string + ">" + email,
    });
  } catch (error) {
    //return server error on catch
    res.status(500).json({ message: error.message });
  }
});

//user Login
app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  switch (true) {
    case !email || !password: //check if all values are provided
      return res.status(400).json({ message: "All fields not provided" });
    case !validator.isEmail(email): //check email validity
      return res.status(400).json({ message: "Not a valid email" });
    case !USERS.some((v) => v.email === email): // Check if the user exists in the USERS array
      return res.status(401).json({ message: "User not found" });
    case USERS.find((v) => v.email === email)?.password !== password: // Also ensure that the password is the same
      return res.status(401).json({ message: "Incorrect password" });
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  //return success
  res
    .status(200)
    .json({ accessToken: AccessToken_Random_string + ">" + email });
});

//get questions
app.get("/questions", function (req, res) {
  //check user auth
  if (!isAuth(req))
    return res.status(401).json({ message: "User not authenticated" });

  res.status(200).json(QUESTIONS);
});

//add questions
app.post("/questions", function (req, res) {
  // leaving as hard todos
  // Create a route that lets an admin add a new problem
  // ensure that only admins can do that.
  const { title, description, testCases } = req.body;

  switch (true) {
    case !title || !description || !testCases: //check if all values are provided
      return res.status(400).json({ message: "All fields are not provided" });
    case !isAuth(req): //check user auth
      return res.status(401).json({ message: "User not authenticated" });
    case getUser(req)?.role !== "admin": //Check if the user is admin
      return res.status(401).json({ message: "Only admins can add questions" });
  }

  try {
    //add question
    QUESTIONS.push({ title, description, testCases });
    //return success
    return res.status(200).json({ message: "Question added" });
  } catch (error) {
    //return server error on catch
    return res.status(500).json({ message: error.message });
  }
});

//get submissions
app.get("/submissions", function (req, res) {
  //Check user auth
  if (!isAuth(req))
    return res.status(401).json({ message: "User not authenticated" });

  //return success
  res.status(200).json({
    submissions: SUBMISSION.filter((v) => v.user === getUser(req)?.email), //filter based on user
  });
});

//add submissions
app.post("/submissions", function (req, res) {
  const { question, submission } = req.body;

  switch (true) {
    case !question || !submission: //check if all values are provided
      return res.status(400).json({ message: "All fields are not provided" });
    case !isAuth(req): //Check user auth
      return res.status(401).json({ message: "User not authenticated" });
    case !QUESTIONS.some((q) => q.title === question): //Check if question is available in questions array
      return res.status(400).json({ message: "Invalid Question submitted" });
  }

  //random result true or false (math.random() gives random value between 0 to 1)
  const result = Math.random() > 0.5;

  try {
    //Add submission
    SUBMISSION.push({
      user: getUser(req)?.email, //get user from accessToken
      question,
      submission,
      result,
    });
    //return success
    res.status(200).json({ result });
  } catch (error) {
    //return server error on catch
    return res.status(500).json({ message: error.message });
  }
});

//util

//auth checker
const isAuth = (req) => {
  //get authorization header
  const Authorization = req.headers["authorization"];

  //if not provided return error
  if (!Authorization)
    return res.status(401).json({ message: "Authorization missing" });

  // split Authorization with " "(\s) or ">" to get user type, reqAccessToken and email
  const [type, reqAccessToken, email] = Authorization.split(/\s|>/);

  //get current user from all users
  const currentUser = USERS.find((v) => (v.email = email));

  //return true if accessToken is correct and user exists, otherwise false
  return reqAccessToken === AccessToken_Random_string && !!currentUser
    ? true
    : false;
};

//current user getter
const getUser = (req) => {
  //get authorization header
  const Authorization = req.headers["authorization"];

  //if not provided return error
  if (!Authorization)
    return res.status(401).json({ message: "Authorization missing" });

  // split Authorization with " "(\s) or ">" to get user type, reqAccessToken and email
  const [type, reqAccessToken, email] = Authorization.split(/\s|>/);

  //get current user from all users
  const currentUser = USERS.find((v) => (v.email = email));

  //return currentUser if accessToken is correct otherwise undefined
  return reqAccessToken === AccessToken_Random_string ? currentUser : undefined;
};

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
