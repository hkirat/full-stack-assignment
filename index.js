const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser"); // Import body-parser middleware
app.use(bodyParser.json()); // Add body-parser middleware for parsing JSON request body

const USERS = [];

const QUESTIONS = [
  {
    problemId: "some-random-uuid",
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
  // Decode the request body to get email and password
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    // If user already exists, return a 409 Conflict status code
    return res.status(409).send("User already exists");
  }

  // If user doesn't exist, create a new user object and add it to the USERS array
  const newUser = { email, password };
  USERS.push(newUser);
  console.log(USERS);

  // Return a 200 status code to the client
  res.status(200).send("User has been successfully");
});

app.post("/login", function (req, res) {
  // Decode the request body to get email and password
  const { email, password } = req.body;

  // Find the user with the given email in the USERS array
  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
    // If user doesn't exist or password is not the same, return a 401 Unauthorized status code
    return res.status(401).send("Invalid email or password");
  }

  // If password is the same, generate a token (e.g., a random string) for the user
  const token = "BACKENDDEVELOPERWASHERE"; // Implement your logic to generate token here

  // Return a 200 status code to the client along with the generated token
  res.status(200).send({ message: "Login successful", token });
});

app.get("/questions", function (req, res) {
  // Return all the questions in the QUESTIONS array with a status code of 200
  res.status(200).send(QUESTIONS);
});

app.get("/submissions/:problemId", function (req, res) {
  // Extract the problemId from the request params
  const problemId = req.params.problemId;

  // Extract the email from the request body
  const { email } = req.body;

  // Filter the submissions array to find matching submissions
  const matchingSubmissions = SUBMISSIONS.filter((submission) => {
    return submission.problemId === problemId && submission.email === email;
  });
  // If no matching submissions are found, return "Not Found" response
  if (matchingSubmissions.length === 0) {
    return res.status(404).json({ error: "Submission not found" });
  }

  // Return the matching submissions as the response
  res.status(200).json(matchingSubmissions);
});

app.post("/submissions", function (req, res) {
  // Let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSIONS array above

  // Extract the submission details from the request body
  const { email, problemId, submittedData } = req.body;

  // Create a submission object
  const submission = {
    email: email, // Store the user email in the submission object
    problemId: problemId, // Store the problemId in the submission object
    submittedData: submittedData,
    isAccepted: Math.random() >= 0.5, // randomly accept or reject the solution
  };

  // Add the submission to the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Return the submission object as the response with a 200 status code
  res.status(200).json(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Codevillage is running on Port: ${port} 🚀`);
});

