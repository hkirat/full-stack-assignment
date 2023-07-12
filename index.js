const express = require('express')
const app = express()
const port = 3000

const USERS = [];

let currentUserId = null;

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {
    userId: "1",
    questionId: "1",
    solution: "function max(arr) { return Math.min(...arr); }",
    status: "rejected",
  },
  {
    userId: "3",
    questionId: "1",
    solution: "function max(arr) { return Math.max(...arr); }",
    status: "accepted",
  },
  {
    userId: "2",
    questionId: "2",
    solution: "function min(arr) { return Math.max(...arr); }",
    status: "rejected",
  },
  {
    userId: "1",
    questionId: "1",
    solution: "function max(arr) { return Math.max(...arr); }",
    status: "accepted",
  },
];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {email, password, isAdmin} = req.body;
  // body should have email and password
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  }
  
  if (isAdmin === undefined) {
    isAdmin = false;
  }
  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const user = USERS.find(user => user.email === email);
  if (user) {
    res.status(400).send("User already exists");
  }
  // create random id for the user
  const id = Math.random().toString(36).substring(7);
  USERS.push({id, email, password, isAdmin});

  // return back 200 status code to the client
  res.status(200).send("User created successfully");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body;

  // body should have email and password
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (!user) {
    res.status(400).send("User does not exist");
  }

  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if (user.password !== password) {
    res.status(401).send("Password is incorrect");
  }
  currentUserId = user.id;
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  res.status(200).json({token: "asklfhosifhoaischosa4324jk2k2k"});
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json({questions: QUESTIONS});
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  const {questionId} = req.query;
  if (!questionId) {
    res.status(400).send("Question id is required");
  }
  const submissions = SUBMISSION.filter(submission => submission.questionId === questionId);
  res.json({submissions});
});


app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const {questionId, solution} = req.body;
  if (!questionId || !solution) {
    res.status(400).send("Question id and solution are required");
  }
  const submission = {
    userId: currentUserId,
    questionId,
    solution,
    status: Math.random() > 0.5 ? "accepted" : "rejected",
  };
  SUBMISSION.push(submission);
  res.status(200).send("Submission created successfully");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/questions", function(req, res) {
  
  const {title, description, testCases} = req.body;
  const currenUser = USERS.find(user => user.id === currentUserId);
  if (!currenUser || !currenUser.isAdmin) {
    res.status(401).send("Only admins can create questions");
  }
  // body should have email and password
  if (!title || !testCases) {
    res.status(400).send("Title and test cases are required");
  }
  const question = {
    title,
    description,
    testCases,
  };
  QUESTIONS.push(question);
  res.status(200).send("Question created successfully");
  
});



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
