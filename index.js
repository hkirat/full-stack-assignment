const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const secretKey = "secret";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.set("view engine", "ejs");
class User { 
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}

const USERS = [
  new User(1, "a", "a"),
  new User(2, "b", "b")
];

const QUESTIONS = [{
    id: 1, 
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},{
    id: 2, 
    title: "Two",
    description: "Find a pair of a numbers in a list that sums up to a target",
    testCases: [{
        input: "[1,2,3,4,5], 9",
        output: "[3, 4]"
    }]
}];

const SUBMISSION = [
  {
    userId: 1,
    questions: [
      {
        questionId: 1,
        submissions: [
          {
            userCode: "int main() {printf('hello world')}",
            language: "c",
            status: "Success", 
          },
          {
            userCode: "int main() {printf('bruh world')}",
            language: "python",
            status: "Success", 
          }
        ]
      }
    ]
  },   
  {
    userId: 2,
    questions: [
      {
        questionId: 1,
        submissions: [
          {
            userCode: "{printf('hello world')}",
            language: "c",
            status: "Fail", 
          },
          {
            userCode: "int main() {printf('bruh world')}",
            language: "python",
            status: "Fail", 
          }
        ]
      }
    ]
  }   
]

app.get('/signup', function(req, res) {
  return res.sendFile(__dirname + "/signup.html");
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let username = req.body.username;
  let password = req.body.password;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let userExists = false;
  USERS.forEach(user => {
    if(user.username == username) {
      userExists = true;
    }
  })

  if(userExists) {
    res.status(403).send('User already exists');
  }
  else {
    let newUser = new User(USERS.length + 1, username, password);
    USERS.push(newUser);
    res.status(200).send('User added!');
  }
  // return back 200 status code to the client
})

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  let username = req.body.username;
  let password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  let userExists = false;
  USERS.forEach(user => {
    if(user.username === username) {
      userExists = true;
      if(user.password === password) {
        const token = jwt.sign({username: username, id: user.id}, secretKey);
        res.cookie('token', token);
        res.status(200).redirect('/questions');
      }
      else {
        res.status(401).send("Invalid password");
      }
    }
  })
  if(!userExists) {
    res.status(404).send("User not found");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Not logged in');
  }
  try {
    const decodedToken = jwt.verify(token, secretKey);
    const username = decodedToken.username;
    // Fetch the questions from the database
    const questions = QUESTIONS;
    // Render the questions page with the username and questions
    res.render(__dirname + '/questions.ejs', { username: username, questions: questions });

  } catch (err) {
    res.status(401).send('Unauthorized');
  }
  //return the user all the questions in the QUESTIONS array
})

app.get("/submissions/:questionId", function(req, res) {
   // return the users submissions for this problem
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Not logged in');
  }
  try {
    const questionId = req.params.questionId;
    const decodedToken = jwt.verify(token, secretKey); 
    const userId = decodedToken.id;
    let currentUser;
    SUBMISSION.forEach(user =>{
      if(user.userId === userId) {
        console.log("Found user");
        currentUser = user;
      } 
    })
    let questionData;
    currentUser.questions.forEach(question =>{
      if(question.questionId == questionId) {
        console.log("Found question");
        questionData = question.submissions;
      }
    })
    if(questionData == undefined) questionData = [];
    res.render(__dirname + "/submissions.ejs", {submissions: questionData})
  } catch(err) {
    res.status(403).send("Unauthorized");
  }
  res.sendFile(__dirname + "/submissions.html", {});
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
