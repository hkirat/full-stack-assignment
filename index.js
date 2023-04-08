const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();


const app = express()
const port = 3001

//MIDDLEWARES
app.use(bodyParser.json()); // Middleware to parse body.

app.use(session({           //Middleware to check session.
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));



//USERS Array to store user information.
const USERS = [{email : 'abi@gmail.com' , pass : 'pass'}];

//List of admins.
const ADMINS = [];

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

app.post('/signup',function(req, res) {
  console.log(req.body);
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  }

  //Checking email already exit or not.
  const doesEmailAlredyExits = USERS.find( user => user.email === newUser.email);
  
  if(doesEmailAlredyExits){
    res.send('Email already exits. Try with a different email');
  }
  else{
    USERS.push(newUser);//Adding new user to USERS Array
    res.status(200); //returning 200 status code.
    res.send('Acoount created sucessfully...')
    // res.redirect('/login');//Redirecting to login page.
  }
})

app.post('/login', function(req, res) {

  const Currentuser = {
    email : req.body.email,
    password: req.body.password
  }

  const isUserPresent = USERS.find(user => user.email === Currentuser.email && user.password === Currentuser.password);

  if(isUserPresent){
    req.session.user = {email : Currentuser.email};
    res.status(200);
    res.send('Login Sucessfull...');
  }
  else{
    res.status(401);
    res.send('Login details incorrect.Retry!');
  }
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