const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const USERS = [];
const ADMINS = ['admin01', 'admin02', 'admin03']

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

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res)=>{
  res.send(
    `
  <html>
    <body>
      <h2 style="text-align: center">Full_Stack_Assignment_1 - 11/5/23</h2>
    </body>
  </html>
  `);
})


app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExist = users.some(user => user.email === email);

  // ! status - 409 indicates that the requests could not completed because of some "conflict" 
  userExist && res.status(409).send("User already exists !");

  // if the user does not exist create a new user object and push the user in USERS arrays
  const newUser = { email, password };
  USERS.push(newUser);
  console.log('user in ');
  // return back 200 status code to the client
  res.status(200).send(`
  <html>
    <body>
      <h2>User signed up succesfully !</h2>
    </body>
  </html>
  `)
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email);

  if(user && user.password == password ){
    const loginToken = Math.random().toString(10).substring(5);
    user.token = loginToken;
    res.status(200).send({token});
  }else{
    res.status(401).send('Login Failed ! please check your username or password');
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Login Route !')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  const userId = req.query.userId
  const problemId = req.query.problemId

  // Filter submissions by user ID and problem ID (if provided)
  const userSubmissions = SUBMISSION.filter(submission => {
    if (problemId) {
      return submission.userId === userId && submission.problemId === problemId
    } else {
      return submission.userId === userId
    }
  })

  // Return user's submissions for the problem (if problem ID provided)
  // or all user's submissions (if no problem ID provided)
  res.send(userSubmissions)
});

app.post("/submissions", (req, res) => {
  const userId = req.body.userId
  const problemId = req.body.problemId
  const solution = req.body.solution

  // Randomly accept or reject the solution (50/50 chance)
  const isAccepted = Math.random() < 0.5

  // Create a new submission object
  const submission = { userId, problemId, solution, isAccepted, timestamp: new Date() }

  // Add the submission to the SUBMISSIONS array
  SUBMISSION.push(submission)

  // Return a response indicating whether the solution was accepted or rejected
  const status = isAccepted ? 'accepted' : 'rejected'
  res.send(`Your solution has been ${status}!`)
});

app.post("/problems", function(req, res) {
  const userRole = req.body.role
  const problem = req.body.problem

  // Check if the user is an admin
  if (!ADMINS.includes(userRole)) {
    return res.status(401).send('Unauthorized')
  }

  // Add the problem to the PROBLEMS array
  PROBLEMS.push(problem)

res.status(200).send('Problem added successfully')
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})