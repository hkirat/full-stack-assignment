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

const SUBMISSION = [];

const AccessToken_Random_string =
  "jasfbasbhjdacuoasdnbvaufisfifvipuafafvqfn9u43fr9qvb49f8rnwfreq";

// middleware
app.use(express.json());

//User signup
app.post("/signup", (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password, role } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  switch (true) {
    case !email || !password || !role:
      return res.status(400).json({ message: "All fields not provided" });
    case !validator.isEmail(email):
      return res.status(400).json({ message: "Not a valid email" });
    case USERS.some((v) => v.email === email):
      return res.status(400).json({ message: "Email already registered" });
    case !validator.isStrongPassword(password):
      return res.status(400).json({ message: "Not a valid password" });
    case !["admin", "user"].includes(role):
      return res
        .status(400)
        .json({ message: 'Role must be either "user" or "admin".' });
  }

  try {
    USERS.push({ email, password, role });
    res.status(200).json({
      user: { email, role },
      accessToken: AccessToken_Random_string + ">" + email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//user Login
app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  switch (true) {
    case !email || !password:
      return res.status(400).json({ message: "All fields not provided" });
    case !validator.isEmail(email):
      return res.status(400).json({ message: "Not a valid email" });

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    case !USERS.some((v) => v.email === email):
      return res.status(401).json({ message: "User not found" });
    case USERS.find((v) => v.email === email)?.password !== password:
      return res.status(401).json({ message: "Incorrect password" });
  }

  res
    .status(200)
    .json({ accessToken: AccessToken_Random_string + ">" + email });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  if (!isAuth(req))
    return res.status(401).json({ message: "User not authenticated" });

  res.status(200).json(QUESTIONS);
});

app.post("/questions", function (req, res) {
  // leaving as hard todos
  // Create a route that lets an admin add a new problem
  // ensure that only admins can do that.
  const { title, description, testCases } = req.body;

  switch (true) {
    case !isAuth(req):
      return res.status(401).json({ message: "User not authenticated" });
    case getUser(req)?.role !== "admin":
      return res.status(401).json({ message: "Only admins can add questions" });
    case !title || !description || !testCases:
      return res.status(400).json({ message: "All fields are not provided" });
  }

  try {
    QUESTIONS.push({ title, description, testCases });
    return res.status(200).json({ message: "Question added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/submissions", function (req, res) {
  if (!isAuth(req))
    return res.status(401).json({ message: "User not authenticated" });

  res.status(200).json({
    submissions: SUBMISSION.filter((v) => v.user === getUser(req)?.email),
  });
});

app.post("/submissions", function (req, res) {
  const { question, submission } = req.body;

  switch (true) {
    case !isAuth(req):
      return res.status(401).json({ message: "User not authenticated" });
    case !question || !submission:
      return res.status(400).json({ message: "All fields are not provided" });
    case !QUESTIONS.some((q) => q.title === question):
      return res.status(400).json({ message: "Invalid Question submitted" });
  }

  const result = Math.random() > 0.5;

  try {
    SUBMISSION.push({
      user: getUser(req)?.email,
      question,
      submission,
      result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json({ result });
});

//util
const isAuth = (req) => {
  const Authorization = req.headers["authorization"];

  if (!Authorization)
    return res.status(401).json({ message: "Authorization missing" });

  const [type, reqAccessToken, email] = Authorization.split(/\s|>/);
  console.log({ reqAccessToken });

  return reqAccessToken === AccessToken_Random_string ? true : false;
};

const getUser = (req) => {
  const Authorization = req.headers["authorization"];

  if (!Authorization)
    return res.status(401).json({ message: "Authorization missing" });

  const [type, reqAccessToken, email] = Authorization.split(/\s|>/);

  const currentUser = USERS.find((v) => (v.email = email));

  return reqAccessToken === AccessToken_Random_string ? currentUser : undefined;
};

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
