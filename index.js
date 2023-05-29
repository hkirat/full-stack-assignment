const express = require('express');
const { auth } = require('./middleware');
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


const SUBMISSIONS = []

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const username = req.body.username;
  const password = req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!USERS.find(user => user.email === username)){
    const user = {
      email : username,
      password : password
    }
    USERS.push(user);
  }

  // return back 200 status code to the client
  res.status(200);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const username = req.body.username;
  const password = req.body.password;


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  if(!USERS.find(user => user.email === username && user.password === password)){
    res.status(401).send('Unauthorized');
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const token = jwt.sign({
    email : user.email,
  }, JWT_SECRET);

  res.status(200).json({ token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  
  const filteredProblems = QUESTIONS.map(q => {
    return {
      problemId: q.problemId,
      difficulty: q.difficulty,
      acceptance: q.acceptance,
    }
  })

  res.json(filteredProblems);
})

app.get('/questions/:id', (req,res) => {
  const id = req.params.id;
  const question = QUESTIONS.find(q => q.problemId === id);
  if(!question){
    return res.status(411).json({});
  }
  res.json(question);
})


app.get('/me', auth, (req,res) => {
  const user = USERS.find(user => user.email === req.body.username);
  res.json({ user });
})


app.get("/submissions/:problemId", auth, function(req, res) {
   // return the users submissions for this problem
   
   const problemId = req.params.problemId;
   const submissions = SUBMISSIONS.filter(problem => problem.problemId === problemId && problem.username === req.username);
   
   res.json({ submissions });
});


app.post("/submissions", auth, function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   
   const isCorrect = Math.random() < 0.5;
   const problemId = req.body.problemId;
   const submission = req.body.submission;

   if(isCorrect){
    SUBMISSIONS.push({
      problemId,
      submission,
      username : req.username,
      status : 'AC',
    });

    res.json({ status : 'AC' });
   }
   else{
    SUBMISSIONS.push({
      problemId,
      submission,
      username : req.username,
      status : 'WA'
    });

    res.json({ status : 'WA' });
   }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})