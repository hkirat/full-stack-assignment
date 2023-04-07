const express = require("express");
const app = express();
const port = 3001;

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

// Route to handle user signup
app.post("/signup", function (req, res) {
  try {
    // Decode the email and password from the request body
    const { email, password } = req.body;

    // Check if the user already exists in the USERS array
    const userExists = USERS.some((user) => user.email === email);

    // If the user already exists, return a 409 Conflict status code
    if (userExists) {
      return res.status(409).send({ message: "User already exists" });
    }

    // Otherwise, create a new user object and add it to the USERS array
    const newUser = { email, password };
    USERS.push(newUser);

    // Return a 201 Created status code and the new user object
    res.status(201).send(newUser);
  } catch (err) {
    // If there was an error decoding the request body, return a 400 Bad Request status code
    res.status(400).send({ message: "An error occured. Please try again!" });
  }
});

// Route to handle user login
app.post("/login", function (req, res) {
  try {
    // Decode the email and password from the request body
    const { email, password } = req.body;

    // Find the user with the given email in the USERS array
    const user = USERS.find((user) => user.email === email);

    // If the user is not found or the password is incorrect, return a 401 Unauthorized status code
    if (!user || user.password !== password) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Otherwise, generate a random token (for now) and return a 200 OK status code
    const token = Math.random().toString(36).substr(2);
    res.status(200).send({ token });
  } catch (err) {
    // If there was an error decoding the request body, return a 400 Bad Request status code
    res.status(400).send({ message: "An error occured. Please try again!" });
  }
});

// Route to get all questions
app.get("/questions", function (req, res) {
  try {
    // Return all the questions in the QUESTIONS array as a JSON response
    res.status(200).json(QUESTIONS);
  } catch (err) {
    // If there was an error, return a 500 Internal Server Error status code
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to add a new question (for admins only)
app.post("/questions", function (req, res) {
  try {
    // Check if the user is an admin
    const isAdmin = req.headers["is-admin"];

    if (isAdmin) {
      // Get the question details from the request body
      const { title, description } = req.body;

      // Validate that the title and description are present
      if (!title || !description) {
        return res.status(400).send({
          message: "Please provide a title and description for the question",
        });
      }

      // Create the new question object
      const newQuestion = {
        title,
        description,
        testCases: [],
      };

      // Add the question to the QUESTIONS array
      QUESTIONS.push(newQuestion);

      // Return a success message
      res.status(200).send({ message: "Question added successfully" });
    } else {
      // If the user is not an admin, return a 401 Unauthorized status code
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    // If there was an error, return a 500 Internal Server Error status code
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to get all submissions for a question
app.get("/submissions", function (req, res) {
  try {
    // Retrieve the question ID from the query parameters
    const questionId = req.query.questionId;

    // Filter the submissions array to get all submissions for the given question ID
    const submissions = SUBMISSION.filter(
      (submission) => submission.questionId === questionId
    );

    // Return the submissions as a JSON response
    res.status(200).json(submissions);
  } catch (err) {
    // If there was an error, return a 500 Internal Server Error status code
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to add a new submission
app.post("/submissions", function (req, res) {
  try {
    // Get the submission details from the request body
    const submission = req.body;

    // Add the submission to the SUBMISSION array
    SUBMISSION.push(submission);

    // Return a success message
    res.status(200).send({ message: "Submission added successfully" });
  } catch (err) {
    // If there was an error, return a 500 Internal Server Error status code
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
