const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  title: "Palindrome",
  description: "Given a string, determine if it is a palindrome?",
  testCases: [{
    input: "racecar",
    output: "true"
  }, {
    input: "hello",
    output: "false"
  }]
},
{
  title: "FizzBuzz",
  description: "Write a function that returns 'Fizz' for multiples of three and 'Buzz' for multiples of five, and 'FizzBuzz' for multiples of both three and five.",
  testCases: [{
    input: "15",
    output: "'FizzBuzz'"
  }, {
    input: "5",
    output: "'Buzz'"
  }, {
    input: "3",
    output: "'Fizz'"
  }]
}];



const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;
  const userExists = USERS.some(user => user.email === email);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!userExists) {
    USERS.push({ email, password });
    console.log(`New user added: ${email}`);
  } else {
    console.log(`User already exists: ${email}`);
  }

  // return back 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email,password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user =>user.email === email);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(user && user.password === password){
    const token = Math.random().toString(36).substring(2);
    res.status(200).json({ token });
  }else{
    res.status(401).send('Invalid email or password');
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const email = req.query.email; // get the email from the query parameter
   const problemIndex = req.query.problemIndex; // get the problem index from the query parameter
 
   // validate the input
   if (!email || !problemIndex || isNaN(problemIndex)) {
     return res.status(400).send("Invalid input");
   }
 
   const problemId = Number(problemIndex) + 1; // compute the problem ID from the index
 
   // find the user's submissions for the specified problem
   const submissions = SUBMISSIONS.filter(submission => {
     return submission.email === email && submission.problemId === problemId;
   });
 
   res.send(submissions);
 
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { email, code } = req.body;
   const problemIndex = req.query.problemIndex;
   const problemId = Number(problemIndex) + 1;
   
   // Randomly accept or reject the solution
   const isAccepted = Math.random() < 0.5;
 
   // Store the submission in the SUBMISSIONS array
   const submission = {
     email: email,
     code: code,
     problemId: problemId,
     isAccepted: isAccepted
   };
   SUBMISSIONS.push(submission);
 
   res.send("Submission received.");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    // If the user is an admin, call the next middleware/route handler
    next();
  } else {
    // If the user is not an admin, return a 401 Unauthorized response
    res.status(401).send('Unauthorized');
  }
}

 app.post("/questions/new",isAdmin,function (req,res){
  const { title, description, testCases } = req.body;
  const newProblem = { title, description, testCases };
  QUESTIONS.push(newProblem);
  res.sendStatus(200);
 })
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})