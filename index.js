const express = require('express')
const app = express()
const port = 3001
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const secret = "dfanhfkjas435873249sjfk";
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const USERS = [{
  email: "your_email@example.com",
  password: "your_password_here"
}];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [{
  question: "Two states",
  code: "function max(arr) { return Math.max(...arr); }",
  status: "Accepted"
}
]

app.post('/signup', function(req, res) {
  const {email, password} = req.body;
  const userExists = USERS.find(user => user.email === email);
  if(userExists) {
    return res.status(400).send("User already exists");
  }

  bcrypt.hash(password, 12, function(err, hash) {
    if(err) {
      return res.status(500).send("Internal Server Error");
    }
    USERS.push({email, password: hash});

    res.status(200).send("User created successfully!");
  })
})

app.post('/login', function(req, res) {

  const {email, password} = req.body;
  const user = USERS.find(user => user.email === email && user.password === password);
  if(!user) {
    return res.status(401).send("Invalid credentials");
  }
  else {
    const token = jwt.sign({email}, secret, {expiresIn: "1h"});  
    const response = {message:"Login successful", token};
    return res.json(response);
  }
})

app.get('/questions', function(req, res) {
  const questions = QUESTIONS.map(question => {
    const title= question.title; 
    const description = question.description; 
    const testCases = question.testCases; 
    return {title, description, testCases}}
  );
  res.status(200).send(questions);
})

app.get("/submissions", function(req, res) {
  const submissions = SUBMISSION.map(submission => {
    const question = submission.question;
    const code = submission.code;
    const status = submission.status;
    return {question, code, status};
  })
  res.status(200).send(submissions);
})

app.post("/submissions", function(req, res) {
  const {question, code} = req.body;
  const status = Math.random() > 0.5 ? "Accepted" : "Rejected";
  SUBMISSION.push({question, code, status});
  res.status(200).send("Submission created successfully");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})