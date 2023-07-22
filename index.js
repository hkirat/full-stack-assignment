const express = require('express')
const app = express()
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))
const port = 3001

const USERS = [{
  mail:"asap@asw.com",
  pass:"asdsa"
}];

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


app.get("/signup",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/signup', function(req, res) {

  // Add logic to decode body
  
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    // If the user with the given email already exists, return 409 (Conflict) status code
    return res.status(409).send('User already exists');
  }

  // If the user with the given email doesn't exist, add the new user to the USERS array
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.sendStatus(200);
    console.log(email,passwd);
    
  // body should have email and password
   

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Find the user with the given email in the USERS array
  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
 
    return res.sendStatus(401);
  }


  const token = Math.random().toString(36).substr(2);
  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  res.json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
  const isAccepted = Math.random() < 0.5; // 50% chance of acceptance

  // Store the submission in the SUBMISSION array above
  SUBMISSION.push({
    problemId: req.body.problemId,
    solution: req.body.solution,
    isAccepted: isAccepted,
  });

  res.sendStatus(200);
});

app.post('/add-problem', function(req, res) {
 
  const isAdmin = USERS.some((user) => user.email === req.body.email && user.isAdmin);

  if (!isAdmin) {
  
    return res.sendStatus(403);
  }

  // Create a new problem object
  const newProblem = {
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases,
  };

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push(newProblem);

  // return back 200 status code to the client
  res.sendStatus(200);
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})