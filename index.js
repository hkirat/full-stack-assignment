const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

const USERS = [];
// console.log(USERS);




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

app.post('/signup', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  // body should have email and password

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.find(user => user.email === email);

  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  } else {
    // return back 200 status code to the client
    // const newUser = 
    USERS.push({ email: email, password: password });
    // console.log(newUser);
    res.status(200).send("User Created")
  }

})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;
  const user = USERS.find(user => user.email === email && user.password === password);


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (user) {
    const token = "Hello World!!!"
    res.status(200).cookie('token', token, { maxAge: 60 * 60 * 1000 }).json({
      success: true,
      message: "Login successfully"
    })
  } else {
    res.status(401).json({
      success: false,
      message: "Please use valid credential"
    })
  }
})

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problem, solution } = req.body;
  const isSolutionAccepted = Math.random() < 0.5;
  const submission = { problem, solution, isSolutionAccepted };
  SUBMISSION.push(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.


// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  const { isAdmin } = req.user;

  if (isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

app.post('/admin/questions', (req, res) => {
  // Get the question data from the request body
  const { title, description, difficulty } = req.body;

  const newQuestion = { title, description, difficulty };
  QUESTIONS.push(newQuestion);
  res.status(201).json({ message: 'Question Created' });
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})