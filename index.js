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
  // Add logic to decode body
    const {email,password} = req.body;
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
const userExists = USERS.find(user => user.email === email);
    if(userExists)
    {
        return res.status(409).send('User with this email already exists');
    }
    USERS.push({email,password});

  // return back 200 status code to the client
    res.sendStatus(200);
  res.send('Hello world');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

const {email,password} = req.body;
  // Check if the user with the given email exists in the USERS array
    const user = USERS.find(user => user.email===email);
    if(!user){
        return res.status(401).send('Invalid email or password');
    }
  // Also ensure that the password is the same
    // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

if(user.password===password)
{
    const token = generateToken();

    return res.status(200).json({token})
}
  res.status(401).send('Invalid email or password');
    
  res.send('Hello world from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
    res.json(QUESTIONS);
    
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    const userId = req.user.id;
    const problemId = req.query.problemId
    const userSubmissions = SUBMISSIONS.filter(submission=> submission.userId === userId && submission.problemId === problemId);
    res.json(userSubmissions);
    res.send("Hello World from route 4!")
});

 // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

app.post("/submissions", function(req, res) {
    const userId = req.user.id;
    const {problemId,solution} = req.body;
    const isAccepted = Math.random()<0.5;

    const submission = {
        userId, 
        problemId,
        solution,
        isAccepted
    };

    SUBMISSIONS.push(Submission);
    const response = isAccepted ? 'Solution accepted!' : 'Solution rejected!';
    res.send(response);
  res.send("Hello World from route 4!")
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problems',isAdmin,function(req,res){
    const {title,description ,difficulty} = req.body;

    const newProblem = {
        title,
        description,
        difficulty
    };
    res.json(newProblem);
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
