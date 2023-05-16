const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  function decodeBody() {
    // Decode the body of the request.
    const body = JSON.parse(request.body);
  
    // Get the email and password from the body.
    const email = body.email;
    const password = body.password;
  
    // Check if the user with the given email already exists.
    const user = USERS.find((user) => user.email === email);
  
    // If the user does not exist, add them to the USERS array.
    if (!user) {
      USERS.push({
        email,
        password,
      });
    }
  
    // Return a 200 status code to the client.
    response.status(200).send();
  }
  
})

app.post('/login', function(req, res) {
  function decodeBody() {
    // Decode the body of the request.
    const body = JSON.parse(request.body);
  
    // Get the email and password from the body.
    const email = body.email;
    const password = body.password;
  
    // Check if the user with the given email exists in the USERS array.
    const user = USERS.find((user) => user.email === email);
  
    // If the user does not exist, return a 401 status code to the client.
    if (!user) {
      response.status(401).send();
      return;
    }
  
    // Check if the password is the same.
    if (user.password !== password) {
      response.status(401).send();
      return;
    }
  
    // Generate a random token.
    const token = Math.random().toString(36).substring(7);
  
    // Create a new user object with the email, password, and token.
    const newUser = {
      email,
      password,
      token,
    };
  
    // Add the new user to the USERS array.
    USERS.push(newUser);
  
    // Return a 200 status code to the client with the token.
    response.status(200).send({ token });
  }
   
})

app.get('/questions', function(req, res) {

  function getQuestions() {
    // Get the questions from the QUESTIONS array.
    const questions = QUESTIONS.slice();
  
    // Return the questions to the client.
    response.status(200).send(questions);
  
})

app.get("/submissions", function(req, res) {
  function getUserSubmissions() {
    // Get the user id from the request.
    const userId = request.query.userId;
  
    // Get the user's submissions from the database.
    const submissions = await db.getUserSubmissions(userId);
  
    // Return the submissions to the client.
    response.status(200).send(submissions);
  }
  
});


app.post("/submissions", function(req, res) {
  function submitProblem() {
    // Decode the body of the request.
    const body = JSON.parse(request.body);
  
    // Get the problem id and solution from the body.
    const problemId = body.problemId;
    const solution = body.solution;
  
    // Generate a random number between 0 and 1.
    const randomNumber = Math.random();
  
    // If the random number is less than 0.5, accept the solution.
    if (randomNumber < 0.5) {
      // Store the submission in the SUBMISSION array.
      SUBMISSIONS.push({
        problemId,
        solution,
        status: "accepted",
      });
  
      // Return a 200 status code to the client.
      response.status(200).send();
    } else {
      // Reject the solution.
      SUBMISSIONS.push({
        problemId,
        solution,
        status: "rejected",
      });
  
      // Return a 400 status code to the client.
      response.status(400).send();
    }
  }
   
});

app.post("/add-problem", (req, res) => {
  // Check if the user is an admin.
  const isAdmin = req.headers.authorization === "Bearer admin-token";

  // If the user is not an admin, return a 401 status code.
  if (!isAdmin) {
    res.status(401).send();
    return;
  }

  // Decode the body of the request.
  const body = JSON.parse(req.body);

  // Get the problem title and description from the body.
  const title = body.title;
  const description = body.description;

  // Add the new problem to the PROBLEMS array.
  PROBLEMS.push({
    title,
    description,
  });

  // Return a 200 status code to the client.
  res.status(200).send();
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})