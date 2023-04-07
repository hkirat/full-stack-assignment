const express = require('express')
const app = express()
const port = 3000

const USERS = [
  {email: "venkatalokeshvl@gmail.com", password : "test1"},
  {email: "venkatalokeshvl1@gmail.com", password : "test2"},
];

const QUESTIONS = [
  {
    id: "find_max",
    title: "Two states Max",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    id: "find_min",
    title: "Two states Min",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
  },

];


const SUBMISSION = [
  { questionId: "find-max", code: "def find_max(arr): return max(arr)", status: "Accepted" },
  { questionId: "find-min", code: "def find_max(arr): return min(arr)", status: "Accepted" },
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.send('Hello World!')

  const { email , password } = req.body;

  const userExist = USERS.find(user => user.email === email);

  if(userExist) {
    res.status(400).send("User with given emal already exist");
  }
  else{
    USERS.push({email,password});
    res.status(200).send("Signup Succesful");
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


  res.send('Hello World from route 2!')

  const {email , password } = req.body;

  const userExist = USERS.find(user => user.email === email);
  
  if(!userExist) {
    res.status(401).send("Email dosen't exist");
  }
  else if(USER.find(user => user.password != password )) {
    res.status(401).send("Password didnt match");
  }
  else{
    res.status(200).send("Login Successful");
  }

})

app.get('/questions', function(req, res) {
  
  res.status(200).json(QUESTIONS);
  
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")

})

app.post('/questions' , function(req,res){
  const ques = req.body;
  QUESTIONS.push(ques);
  res.status(200).send("Question Inserted Succesfully");
})

app.get("/submissions", function(req, res) {

  res.status(200).json(SUBMISSION);

   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {

  const submission = req.body;

  if(submission === "submit"){

    SUBMISSION.push(submission);
  
    res.status(200).json(SUBMISSION);

  }

  else{

    res.status(401).send("Submission Failed");

  }



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