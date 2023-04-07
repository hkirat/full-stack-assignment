const express = require('express')
const path = require("path")
const bodyParser = require('body-parser');


const app = express()
const port = 3000


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true })); 


const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
 {
  title: "Find the minimum",
  description: "Given an array , return the minimum of the array",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "1"
  }]
 },
 {
  title: "Find the element",
  description: "Given an array , return the index of the given element in that array",
  testCases: [{
      input: "[1,2,3,4,5] 3",
      output: "2"
  }]
 },
 {
  title: "Sort Me",
  description: "Given an array , return the sorted array (ascending order)",
  testCases: [{
      input: "[3,1,2,5,4]",
      output: "[1,2,3,4,5]"
  }]
 },
 {
  title: "Sort me in reverse",
  description: "Given an array , return the sorted array (descending order) ",
  testCases: [{
      input: "[3,1,2,5,4]",
      output: "[5,4,3,2,1]"
  }]
 },
 {
  title: "Palindrome or not",
  description: "Given a string, check if it is palindrome or not",
  testCases: [{
      input: "1001",
      output: "yes, it is a palindrome"
  }]
 }
];



const SUBMISSION = [

]


app.get("/", (req, res) => {
  res.send("heyyy")
})

app.get('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.status(200).sendFile(path.join(__dirname, "public", "signup.html"))
})

app.post('/signup', function(req, res) {
  const email = req.body.email
  const password = req.body.password
  USERS.push({email, password})

  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email) {
      res.status(401).send("User already exists")
    }
  }

  console.log(USERS)
  // return back 200 status code to the client
  res.status(200).json("Signed in successfully")
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const email = req.body.email;
  const password = req.body.password;

  console.log(USERS)

  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email && USERS[i].password === password) {
      res.status(200).json({message: "Logged in successfully", token:"sdagfuigufvag"})
    }
  }
  res.status(401).send('Credendials does not match. Signup or try again')
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
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