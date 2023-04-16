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

app.use(express.json());

app.post('/signup', function(req, res) {
  const {email, password} = req.body;
  const userExist = USERS.some(user => user.email === email);
  if(userExist) {
    return res.status(409).send("User already exists");
  }
  USERS.push({email, password});
  res.status(200).send('Successfully signed up!');
})

app.post('/login', function(req, res) {
  const {email, password} = req.body;
  const user = USERS.find(user => user.email === email);
  if(!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  res.status(200).send('Successfully logged in!');
})

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   const {problemId, solution} = req.body;
   const isAccepted = Math.random() < 0.5;
   const submission = {problemId, solution, isAccepted};
   if(!isAccepted) {
    SUBMISSION.push([...submission]);
    res.status(201).send("submission Accepted");
   }else {
    res.status(400).send("submission Rejected");
   }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})