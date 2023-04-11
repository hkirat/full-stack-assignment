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

];
app.use(express.json());
//This ensures that any incoming request with a JSON payload will be parsed by the middleware before it is passed on to the route handler.

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body();

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!email || !password) {
    return res.status(400).send("Email and Password both required.")
  }

  const userExist = USERS.some(u => u.email === email);
  if (userExist) {
    return res.status(409).send("This email-id already exist, Please Log-in")
  }
  USERS.push({email,password});

  // return back 200 status code to the client
  res.sendStatus(200);
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body();

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(u => u.email === email && u.password === password);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(!user) {
    res.status(401).send("Invalid email or password");
  }
  const token = "Random token for login";
  res.status(200).json({token});

  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.json(SUBMISSION);
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const {solution, questionId} = req.body();
  const question = QUESTIONS.find(q => q.id === questionId);

  const isAccepted = Math.random() >= 0.5;
  
  const submission = {
    solution,
    isAccepted,
    question
  };
  SUBMISSION.push(submission)
  res.send("Submitted Succesfully");
  res.json(submission);
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post('/problems', function(req, res) {
  const {title , description, testCases} = req.body();
  const isAdmin = req.headers.authorization;
  if (isAdmin !== "adminToken") {
    return res.status(401).send("Unauthorized access");
  }
  const problem = {
    id: QUESTIONS.length +1,
    title,
    description,
    testCases
  }
  QUESTIONS.push(problem);
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})