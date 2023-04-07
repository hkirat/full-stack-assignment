const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({extended: false}));
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


const SUBMISSION = [];

app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  if(!email || !password) {
    res.status(400).send("Missing credential/credentials");
    return;
  }

  const alreadyExists = USERS.find(user => user.email === email);
  if(alreadyExists) {
    res.status(400).send("User already exists");
    return;
  }

  USERS.push({email, password});
  res.status(200).send('Sign up Successfull')
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;
  if(!email || !password) {
    res.status(400).send("Missing credential/credentials");
    return;
  }

  const isUser = USERS.find(user => user.email === email);
  if(!isUser) {
    res.status(400).send("User doesn't exists.");
    return;
  }

  const isValid = isUser.password === password;
  if(!isValid) {
    res.status(401).send("Invalid password");
    return;
  }

  res.status(200).send('Log in successfull');
})

app.get('/questions', function(req, res) {
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  const { title } = req.body;
  const subs = SUBMISSION.filter(sub => sub.title === title);
  
  res.status(200).json(subs);
});


app.post("/submissions", function(req, res) {
  const { title, solution } = req.body;

  if(Math.random() < 0.5) {
    res.status(400).send("Test cases failed.")
    return;
  }

  SUBMISSION.push({title, solution});
  res.status(200).send("SUbmission accepted");
});

app.post('/question', function(req, res, next) {
  const { email, password } = req.body;
  if(!email || !password) {
    res.status(400).send("Missing credential/credentials");
    return;
  }
  
  const isUser = USERS.find(user => user.email === email && user.password === password);
  if(!isUser) {
    res.status(401).send("Authorization failed try again with valid credentials")
    return;
  }

  if(isUser.role !== "Admin") {
    res.status(400).send("User is not an admin.");
    return;
  }

  next();
}, function(req, res) {
    const { title, description, testCases } = res.body;
    QUESTIONS.push({title, description, testCases});
    res.status(200).send("Question added successfully.");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
