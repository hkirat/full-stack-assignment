const express = require('express')
const app = express()

app.use(express.json());

const port = 3000

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSION = []

app.post('/signup', function (req, res) {
  const { email, password } = req.body;

  // Check if the email already exists in the users array
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    res.status(409).send('Email already exists');
  }

  USERS.push({ email, password })
  res.send('User registered successfully');
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
})


app.post('/login', function (req, res) {
  const { email, password } = req.body;
  const existingUser = USERS.find(user => user.email === email);

  if (!existingUser) {
    res.status(401).send('Email or password is incorrect');
  }
  if (existingUser.password !== password) {
    res.status(401).send('Email or password is incorrect');
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const token = "randomstring"
  res.json({ message: 'Logged in successfully', token });
})


  //return the user all the questions in the QUESTIONS array
app.get('/questions', function (req, res) {
  res.json(QUESTIONS);
})


  // return the users submissions for this problem
app.get("/submissions", function (req, res) {
  res.json(SUBMISSION);


});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const { problem, solution } = req.body;
  const isAccepted = Math.random() < 0.5;
  const submission = { problem, solution, isAccepted };
  SUBMISSION.push(submission);

  res.status(isAccepted ? 200 : 401).json(submission);
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/user/admin", function (req, res) {

  const {title,description,testCases} = req.body;
  const isAdmin = true;//hardcoded for now , should be replaced with the real authentication logic

   if(!isAdmin){
    return res.status(401).send("Your not authorized to add questions");
   }

   const newProblem = [{
    title: "sum of array",
    description: "Given an array  return the sum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "15"
    }]
  }]

   QUESTIONS.push(newProblem);
   res.send("Question added successfully");
  }
)


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});