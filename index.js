const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");

const app = express();
const port = 3000;

const JWT_SECRET = "asdfghhghgh"; // Random key for the JWT token

const errorHandler = (res, status = 500, message = "Internal Server Error") =>
  res.status(status).json({ status: false, message });

const isUserExist = (email) => USERS.find((user) => user.email === email);

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET);

const cookiesSetter = (res, token, set) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", set ? token : "", {
      path: "/",
      httpOnly: true,
      maxAge: set ? 15 * 24 * 60 * 60 * 1000 : 0, // max time for the cookie
    })
  );
};

const checkAuth = (req) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const token = cookie.split("=")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = USERS.find((user) => user.id === decoded.id);
  return user;
};

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
const PROBLEMS = [];

app.use(express.json());
app.post("/signup", async (req, res) => {
  /* TODO :
    1. Add logic to decode body
    2. body should have email and password
    3. Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    4. return back 200 status code to the client
  */

  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return errorHandler(res, 400, "Please fill all the fields");

  if (isUserExist(email))
    return errorHandler(res, 400, "User already register with this email");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: USERS.length + 1,
    email: email,
    password: hashedPassword,
    role: role,
  };

  USERS.push(user);

  const token = generateToken(user.id);
  cookiesSetter(res, token, true);

  res.status(200).json({
    success: true,
    message: "Register Successfully",
    user,
  });

  console.log("Register Successfully");
});

app.post("/login", async (req, res) => {
  /* TODO :
      1. Add logic to decode body
      2. body should have email and password
      3. Check if the user with the given email exists in the USERS array
      4. Also ensure that the password is the same
      5. If the password is the same, return back 200 status code to the client
      6. Also send back a token (any random string will do for now)
      7. If the password is not the same, return back 401 status code to the client
    */
  const { email, password } = req.body;

  if (!email || !password)
    return errorHandler(res, 400, "Please fill all the fields");

  const user = USERS.find((user) => user.email === email);
  if (!user)
    return errorHandler(res, 400, "User not exist. Please register first");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch)
    return errorHandler(res, 400, "Invalid email or password");

  const token = generateToken(user.id);
  cookiesSetter(res, token, true);

  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
  });
  console.log("Login Successfully");
});

app.get("/logout", (req, res) => {
  cookiesSetter(res, null, false);

  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
  console.log("Logged out Successfully");
});

app.get("/questions", (req, res) => {
  /* TODO 
    return the user all the questions in the QUESTIONS array
  */

  const user = checkAuth(req);
  console.log("***Getting the questions");
  console.log(user);
  if (!user) return errorHandler(res, 401, "Please Login first!");

  res.status(200).json({
    success: true,
    message: "Questions Get Successfully",
    questions: QUESTIONS,
  });
  console.log("Questions Get Successfully");
});

app.get("/submissions", (req, res) => {
  /* TODO 
    return the users submissions for this problem
  */

  const user = checkAuth(req);
  if (!user) return errorHandler(res, 401, "Please Login first!");

  res.status(200).json({
    success: true,
    message: "Submissions Get Successfully",
    questions: SUBMISSION,
  });
  console.log("Submissions get Successfully");
});

app.post("/submissions", function (req, res) {
  /*TODO
    let the user submit a problem, randomly accept or reject the solution
    Store the submission in the SUBMISSION array above
  */

  // Checking user is login or not
  const user = checkAuth(req);
  if (!user) return errorHandler(res, 401, "Please Login first!");

  const { problemId, solution } = req.body;

  if (!problemId || !solution)
    return errorHandler(res, 401, "Invalid Submission, Please try again later");

  const isAccepted = Math.random() < 0.5;
  const sumbission = {
    problemId,
    solution,
    isAccepted,
  };

  SUBMISSION.push(sumbission);

  res.status(200).json({
    success: true,
    status: isAccepted ? "accepted" : "rejected",
  });

  res.send("Hello World from route 4!");
});

app.post("/addproblem", function (req, res) {
  /*TODO
    Create a route that lets an admin add a new problem
    ensure that only admins can do that.
  */

  // Checking user is login or not
  const admin = checkAuth(req);

  console.log(admin);
  if (!admin) return errorHandler(res, 401, "Please Login first!");

  if (admin.role != "admin")
    return errorHandler(
      res,
      401,
      "Unauthorize. Only admin can perform this operation"
    );

  const { problem } = req.body;

  if (!problem)
    return errorHandler(
      res,
      401,
      "Invalid problem, Please fill all the details"
    );

  PROBLEMS.push(problem);

  console.log(PROBLEMS);

  res.status(200).json({
    success: true,
    message: "Problem Added Successfully",
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
