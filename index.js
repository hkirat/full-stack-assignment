const express = require('express')
const bodyParser = require('body-parser')
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
},
{
  id: 2,
  title: "Distinct States",
  description: "Given an array , return the Distinct elements of the array?",
  testCases: [{
      input: "[1,1,2,2,3,3,4,5,6,3,7,8,9,9]",
      output: "[4,5,6,7,8]"
  }],
}
];


const SUBMISSION = []

app.post('/signup', function(req, res) {
  // Add logic to decode body

  const {name, email, password} = req.body

  // body should have email and password
  if(USERS.find((user)=>  user.email === email)) {
    res.send('user already exists')
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
  USER.push({name, email, password})

  // return back 200 status code to the client
 res.status(200).send('user added successfully')
}) 

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {name, email, password} = req.body
  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user)=> user.email === email )
  if(!user) {
    res.sendStatus(400).send('User exists already, please sign in')
  }
  // Also ensure that the password is the same
  if (user.password != password) {
    return res.status(401).send("incorrect email or password!");
  }
 
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = "AnyToken";
  res.status(200).send({ token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION)
});


app.post("/submissions", function(req, res) {
// let the user submit a problem, randomly accept or reject the solution
// Store the submission in the SUBMISSION array above
  const {questionId, email, isSolved} = req.body
  if(isSolved){
    USERS.get(email).push(questionId, isSolved)
  }
  USERS.get(email).push(questionId, isSolved)
  SUBMISSION.push({email, questionId, isSolved})
  res.sendStatus(200)   
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})