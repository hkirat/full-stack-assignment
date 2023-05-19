const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const USERS = [];

let QUESTIONS = [{
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


 const { email, password } = req.body || {};


  if (!email) {
    return res.status(400).send('Email is required');
  }

  const userExists = USERS.some(user => user.email === email);
  if (!userExists) {
    USERS.push({ email, password });

    res.sendStatus(200);
  } else {
    res.status(409).send('User already exists');
  }



app.post('/login', function(req, res) {

    const { email, password } = req.body;
    
    
  const user = USERS.find(user => user.email === email);
  if (!user || user.password !== password) {
    res.status(401).send("Invalid email or password.");
    return;
  }

  const token = "randomstring"; 
  res.status(200).json({ token: token });

  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {

  res.send("Hello World from route 4!")
});



