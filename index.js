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
  const {
    email,
    password
  } = req.body;

  

  if (!USERS.find((user) => user.email === email)) {
    USERS.push({
      email,
      password
    });
  }
 res.status(200).send("OK");
});


app.post('/login', function(req, res) {
 const {
    email,
    password
  } = req.body;

  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }
    
  const token = "random-string";
  res.status(200).send({
    token
  });
});

app.get('/questions', function(req, res) {

  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const accepted = Math.random() < 0.5;
});


app.post("/submissions", function(req, res) {
   SUBMISSION.push(req.body);

  // send a response to the user
  if (accepted) {
    res.send("Your solution was accepted!");
  } else {
    res.send("Your solution was rejected.");
  }
});

app.post("/problems", function (req, res) {
  // check if the user is an admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send("Unauthorized");
  }

  // add the new problem to the PROBLEMS array
  PROBLEMS.push(req.body);

  // send a response to the user
  res.send("Problem added successfully!");
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
