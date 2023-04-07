const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3002

//middleware
app.use(express.json())
app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}, {

  //2nd question
  title: "1. Two Sum",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order" ,
  testCases: [{
    input: "nums = [2,7,11,15], target = 9",
    output: "[0,1]"
  }]
}
];


const SUBMISSION = [

]

app.get("/", (req,res) => {
  res.send("Welcome to brand new LEETCODE ")
})

// signup route
app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    return res.status(400).send("User already exists");
  }

  // add user to USERS array
  USERS.push({ email, password });


  // return back 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const { email, password } = req.body;

  // find user with the given email
  const user = USERS.find(user => user.email === email);


  // If the password is not the same, return back 401 status code to the client

  if (!user || user.password !== password) {
    // user not found or password doesn't match
    return res.status(401).send("Invalid email or password");
  }

   // generate and send back token
   const token = Math.random().toString(36).substring(7);
   res.status(200).json({ token });
})

// get all questions
app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})


// get submissions for a specific problem
app.get("/submissions", function (req, res) {

  // return the users submissions for this problem
  const { problemTitle } = req.query;
  const submissions = SUBMISSION.filter(submission => submission.problemTitle === problemTitle);
  res.json(submissions);
  
});

// submit a solution for a problem
app.post("/submissions", function (req, res) {

  // let the user submit a problem, randomly accept or reject the solution
  const { problemTitle, solution } = req.body;

    // randomly accept or reject the solution
    const isAccepted = Math.random() >= 0.5;

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push({ problemTitle, solution, isAccepted });

    // return success status code to client
    res.sendStatus(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// add a new problem (admin only)
app.post("/problems", function(req, res) {
  // check if user is admin (hardcoded for now)
  const isAdmin = true;

  if (!isAdmin) {
    return res.status(401).send("Unauthorized");
  }

  // console.log(req.body)
  const { title, description, testCases } = req.body;

  // add new problem to QUESTIONS array
  QUESTIONS.push({ title, description, testCases });

  // return success status code to client
  res.sendStatus(200);
  // console.log(QUESTIONS);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})