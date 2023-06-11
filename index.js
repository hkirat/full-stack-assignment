const express = require('express')
const validator = require('validator') // To validate email addresses
const util  = require('./util')
const app = express()
const port = 3001

//Using express to read urlencoded data
//extended option determines whether to use in-built querystring or qs library to parse the data
//extended option is set to false that means in-build querystring will be used
app.use(express.urlencoded({ extended: false }));

const USERS = [
  {
    email:'jatin@gmail.com',
    password:'password'
  }
];

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
  console.log("****** /signup invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if the email address already exists in the USERS array
  let email = req.body.email;
  for(let user of USERS){
    if(user.email === email){
      console.log("Email '"+email+"' already exists in our system.");
      res.send("An account with email '"+email+"' already exists.");
      return;
    }
  }

  // Check if the email address is valid
  if(!validator.isEmail(email)){
    console.log("Email address '"+email+"' is invalid.")
    res.send("Email address invalid!");
    return;
  }

  // Check if the password is valid (at least 8 characters long & alpha numeric)
  let password = req.body.password;
  if(!util.passwordIsValid(password)){
    console.log("Invalid password '"+password+"'");
    res.send("Password should be atleast 8 characters long and should only contain alpha numeric characters");
    return;
  }

  // Add the credentials to the USERS array
  USERS.push(req.body);
  console.log("The credentials "+JSON.stringify(req.body)+" have been added to the USERS array");
  console.log("USERS array : "+JSON.stringify(USERS));

  // Return success response along with 200 status code
  res.status(200).send("SignUp successful!");
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