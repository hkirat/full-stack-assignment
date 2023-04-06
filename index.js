const express = require("express");

const app = express();
const port = 3001;

/*
Maybe hash password with bcrypt when adding next time.
//const saltRounds = Math.floor(Math.random() * 1024);
function saltPassword(plaintextPass) {
  bcrypt.genSalt(saltPassword, function (err, salt) {
    bcrypt.hash(plaintextPass, salt, function (err, hash) {

    });
  });
}
*/

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

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
};

const SUBMISSION = [];

//using express.urlencoded; not sure if could use bodyParser or not
// https://www.geeksforgeeks.org/express-js-express-urlencoded-function/

app.use(express.urlencoded({ extended: true }));

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    res.status(409).json({
      error: "User Exists; not creating new user!",
    });
  } else {
    const id = uuidv4();
    USERS.push({ id, email, password });
    res.json({ message: "User created successfully", user: user });
    // return back 200 status code to the client
    res.status(200);
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  userfound = false;
  const userfound = USERS.find((user) => user.email === email);
  if (!userfound) {
    return res.status(401).send("User not Found");
  }
  if (user.password !== password) {
    return res.status(401).send("Password not Found");
  }

  // If the password is the same, return back 200 status code to the client
  //created a guid using this token
  //https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  const userToken = uuidv4();
  // Also send back a token (any random string will do for now)
  user.token = userToken;
  // If the password is not the same, return back 401 status code to the client

  res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  // assuming the questions here mean returning the title of the questions
  QUESTIONS.forEach((item) => {
    res.status(200).send(item.title);
  });
});

//Authorization Reference Used: https://www.geeksforgeeks.org/basic-authentication-in-node-js-using-http-header/
app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const userToken = req.headers.authorization;

  //checking if user present or not
  const userfound = USERS.find((user) => user.token === userToken);

  if (!userfound) {
    return res.status(401).send("Authorization Required!");
  }
  const problemUUID = req.query.problemUUID;
  const submissions = SUBMISSION.filter(
    (submission) =>
      submission.userId === user.id &&
      submission.problemUUID === problemUUID &&
      submission.solution,
  );
  res.status(200).send(submissions);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const userToken = req.headers.authorization;

  const userfound = USERS.find((user) => user.token === userToken);

  if (!userfound) {
    return res.status(401).send("Authorization Required");
  }
  const { problemUUID, soln } = req.body;

  const isAccepted = Math.random() < 0.69;

  const submissionFormat = {
    problemUUID: uuidv4(),
    userId: user.id,
    problemUUID,
    soln,
    isAccepted,
  };

  SUBMISSION.push(submissionFormat);
  res.status(200).send({
    message: isAccepted
      ? "Solution Accepted 🥳"
      : "Solution has been Rejected 😭",
    submission: submissionFormat,
  });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
