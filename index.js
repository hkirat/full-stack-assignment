const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

const USERS = [];

var UserId = 1;
var questionId = 1;

const QUESTIONS = [{
    id: questionId++,
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
    var user = {};
    user.email = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.isAdmin = false;
    user.isTester = false;
    user.isDeveloper = false;
    user.id = UserId;
    UserId++;

    if (USERS.find(u => u.email === user.email)) {
        res.status(400).json({message: "User already exists"});
        console.log(USERS)
        return;
    }else {
        USERS.push(user);
        console.log(USERS);
    }

    res.status(200).json({message: "User created successfully"})
})

app.post('/login', function(req, res) {
  var user = req.body;
  let userFound = null;
  for (var i = 0; i<USERS.length; i++) {
    if (USERS[i].email === user.email && USERS[i].password === user.password) {
        userFound = USERS[i];
        break;
    }
  }
  if (userFound) {
    res.status(200).send(userFound);
  } else {
    res.sendStatus(401);
  }
})

app.get('/questions', function(req, res) {
  for (var i = 0; i<QUESTIONS.length; i++) {
    res.status(200).json(QUESTIONS[i]);
  }
})

app.get("/submissions", function(req, res) {
  for(var i = 0; i<SUBMISSION.length; i++) {
    if (SUBMISSION[i].userId === req.body.userId && SUBMISSION[i].questionId === req.body.questionId) {
       res.status(200).json(SUBMISSION[i]);
    }
 }
});


app.post("/submissions", function(req, res) {
  var submission = req.body;
  SUBMISSION.push(submission);
  res.status(200).json({message: "Submission created successfully"})
});

app.post("addQuestions", function (req, res) {
  if (req.body.isAdmin) {
    var question = req.body;
    question.id = questionId;
    QUESTIONS.push(question);
    res.status(200).json({message: "Question added successfully"});
  }
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})