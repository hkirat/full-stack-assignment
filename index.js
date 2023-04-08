const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    // Return 409 Conflict status code if user already exists
    res.status(409).send('User already exists');
  } else {
    // Create a new user object with the email and password
    const newUser = {
      email,
      password
    };

    // Add the new user object to the USERS array
    USERS.push(newUser);

    // Return 200 OK status code and success message
    res.status(200).send('User created successfully');
  }
})

app.post('/login', function(req, res) {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Find the user with the given email in the USERS array
  const user = USERS.find(user => user.email === email);

  if (!user) {
    // Return 401 Unauthorized status code if user doesn't exist
    res.status(401).send('Invalid email or password');
  } else if (user.password !== password) {
    // Return 401 Unauthorized status code if password is incorrect
    res.status(401).send('Invalid email or password');
  } else {
    // Generate a random token for the user
    const token = Math.random().toString(36).substring(2);

    // Add the token to the user object for future requests
    user.token = token;

    // Return 200 OK status code and the token to the client
    res.status(200).json({ token });
  }
})

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  // Extract the submission title from the query parameter
  const { title } = req.query;

  // Filter the submissions array to only include submissions with matching titles
  const matchingSubmissions = SUBMISSION.filter(submission => submission.title === title);

  // Return 200 OK status code and the matching submissions array to the client
  res.status(200).json(matchingSubmissions);
});


app.post("/submissions", function(req, res) {
  // Extract the submission data from the request body
  const { title, description, code } = req.body;

  // Randomly accept or reject the solution
  const isAccepted ="YES";
  // Create a new submission object with the submission data and acceptance status
  const newSubmission = {
    title,
    description,
    code,
    isAccepted
  };

  // Add the new submission object to the SUBMISSION array
  SUBMISSION.push(newSubmission);

  // Return 200 OK status code and the submission acceptance status to the client
  res.status(200).json({ isAccepted });
});



// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// Define an array of admin usernames
const ADMINS = ["admin1", "admin2", "admin3"];
// Define a middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  const { username } = req.body;
  if (ADMINS.includes(username)) {
    // If the user is an admin, call the next middleware function
    next();
  } else {
    // If the user is not an admin, return a 403 Forbidden status code
    res.status(403).send("You are not authorized to access this resource.");
  }
}

// Define a POST endpoint to add a new problem (only accessible to admins)
app.post("/admin/problems", isAdmin, function(req, res) {
  // Extract the problem data from the request body
  const { title, description, testCases } = req.body;

  // Create a new problem object with the problem data
  const newProblem = {
    title,
    description,
    testCases
  };

  // Add the new problem object to the PROBLEMS array
  QUESTIONS.push(newProblem);

  // Return a 200 OK status code and the new problem object to the client
  res.status(200).json(newProblem);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})