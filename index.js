const express = require('express')
const app = express()
const port = 3001

const USERS = [
  { userId: 1, email: "test1@gmail.com", password: "pass1" },
  { userId: 2, email: "test2@gmail.com", password: "pass2" },
];

const QUESTIONS = [
  {
    id:"1"  ,
    title: "Two states",
      description: "Given an array , return the maximum of the array?",
      testCases: [{
          input: "[1,2,3,4,5]",
          output: "5"
      }]
  },  {
    id:"2"  ,
    title: "Three states",
      description: "Given an array , return the min of the array?",
      testCases: [{
          input: "[1,2,3,4,5]",
          output: "5"
      }]
  },

];

const SUBMISSION = [
  { userId: "1", questionId: "find-max", code: "def find_max(arr): return max(arr)", status: "Accepted" },
  { userId: "1", questionId: "find-min", code: "def find_min(arr): return min(arr)", status: "Accepted" },
  { userId: "2", questionId: "find-max", code: "def find_max(arr): return min(arr)", status: "Rejected" },
]
const isAdmin = (req, res, next) => {
  const isAdminUser = req.headers.authorization === "admin";
  if (isAdminUser) {
    next();
  } else {
    res.status(403).send("You do not have permission to perform this action.");
  }
}
app.use(express.json());
app.post('/signup', function(req, res) {
 const {email, password} = req.body;
  const userExists=USERS.find(user => user.email === email);
  if(userExists)
  {
    req.status(400).send("User already exists");
  }
  else{
    USERS.push({email,password});
    req.status(200).send("signed up!!");
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
const {email,password}=req.body;
if(USERS.find(user => user.email=== email))
{
  res.status(200).send("logged in succesfully");
}
else if(password!== user.password  ){
res.status(401).send("Incorrect password")
}
else{
  const token="token";
  res.status(200).json({token});
}
})

app.get('/questions', function(req, res) {
res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
const submission=req.body;
const isAccepted = Math.random >=0.5;
submission.status=isAccepted?"Accepted" : "Rejected";
SUBMISSION.push(submission);
req.status(200).json(SUBMISSION);
});

app.post("/questions",isAdmin,(req,res) =>{
  const question=req.body;
  QUESTIONS.push(question);
  res.status(200).send("Question added");
});
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})