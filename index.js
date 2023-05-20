const express = require('express');
const crypto = require('crypto');
const app = express()
const port = 3000

app.use(express.json());
const USERS = [
  {
    email: 'Akshay@xyz.com',
    password: 'ak123',
    isAdmin: true
  },
  {
    username: 'Ballal@xyz.com',
    password: 'ba123',
    isAdmin: false
  }
];

const QUESTIONS = [{
  id: 1,
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  id: 2,
  title: "Palindrome",
  description: "Given a string , check if it palindrome or not",
  testCases: [{
    input: "aka",
    output: true
  }]
}];


const SUBMISSION = [
  {
    id: 1,
    questionID: 1,
    answer: "test_1",
    status: "accepted"
  },
  {
    id: 2,
    questionID: 1,
    answer: "test_2",
    status: "rejected"
  },
  {
    id: 3,
    questionID: 2,
    answer: "test_1",
    status: "accepted"
  }
]

function getRandomInt(min, max) {
  min = Math.ceil(min); // Round up the minimum value
  max = Math.floor(max); // Round down the maximum value
  return Math.floor(Math.random() * (max - min + 1)) + min; // Generate a random integer within the range
}

function generateRandomToken(length) {
  const token = crypto.randomBytes(length).toString('hex');
  return token;
}

app.post('/signup', function (req, res) {
  const { email, password, isAdmin } = req.body;
  const Userexists = USERS.some(user => user.email === email);
  if (Userexists) {
    return res.status(400).send("User with the same email already exists.");
  }

  USERS.push({ email, password, isAdmin });
  res.status(200).send("User signed up successfully");
})

app.post('/login', function (req, res) {
  const { email, password } = req.body;
  USERS.forEach(user => {
    if (user.email === email) {
      if (user.password === password) {
        res.send("Login successful, here is the token - " + generateRandomToken(11));
      }
      else {
        res.status(401).send("Password is incorrect.")
      }
    }
  });
  res.status(401).send("User doesn't exist, Sign up maybe ?")
})

app.get('/questions', function (req, res) {
  res.send(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  res.send(SUBMISSION)
});

app.post("/submissions", function (req, res) {
  const { questionID, answer } = req.body;
  const a = Math.random(1, 2);
  if (a < 0.5) {
    SUBMISSION.push({ id: getRandomInt(1,100), questionID, answer, status: "accepted" });
    return res.status(200).send("Accepted");
  }
  else {
    SUBMISSION.push({ id: getRandomInt(1,100), questionID, answer, status: "rejected" });
    return res.status(200).send("Rejected");
  }
});

app.post("/admin/questions", function (req, res) {
  const { email, title, description, testCases } = req.body;
  const Userexists = USERS.some(user => user.email === email);
  USERS.forEach(user => {
    if (user.email === email) {
      if (user.isAdmin) {
        QUESTIONS.push({ id: getRandomInt(1,100), title, description, testCases });
        return res.status(200).send("Question added successfully");
      }
      else {
        return res.status(401).send("You are not an admin");
      }
    }
  });
  return res.status(401).send("User doesn't exists");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})