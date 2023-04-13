const express = require('express')
const app = express()
const port = 5000
const path = require("path");
const bodyParser = require("body-parser");
const { ucs2 } = require('punycode');

const USERS = [];

const publicDir = path.join(__dirname, './public')
app.use(bodyParser.urlencoded({ extended: true }));
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


app.use(express.static(publicDir))
app.set('view engine', 'hbs')


app.get('/login', function(req, res) {
  //web page
  res.render("login")
})

app.get('/signup', function(req, res) {
  //web page
  res.render("signup")
})


app.post('/signup', function(req, res) {
  //Get sign up information
  const {uname, email, password, re_password} = req.body
  const user_exists = USERS.some(
    (user) => user.email == email
  );
  //if there is mismatch in confirm password
  if(password !== re_password){
    res.status(400).send("Password do not match")
  }
  //if user is already a registered user
  else if(user_exists){
    res.status(400).send('User already exists! Please login')
  }
  //add user details to USERS array (db in future)
  else{
    USERS.push({email: email, pass: password, name: uname, type: 'coder'})
    res.status(200).redirect('login')
  }
})


app.post('/login', function(req, res) {
  const { email, password } = req.body;
  const validate = USERS.some(
    (user) => user.email === email && user.pass === password
  );
  if(validate){
    // Also send back a token (any random string will do for now)
    res.status(200).redirect('questions')
  }
  else{
    //Try status 204
    res.status(401).send("Invalid credentials!")
  }
})


app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.render('questions')
})


app.get("/submission", function(req, res) {
   // return the users submissions for this problem
  res.render('submission')
});


app.post("/submission", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const acceptance = (parseInt(Math.random() * 100) % 2)
   if(acceptance){
    const {email, title, code} = req.body
    const userAttempt = {
      email: email,
      title: title,
      code: code
    };
    SUBMISSION.push(userAttempt)
    res.send('Submission Accepted!')
   }
   else{
    res.send('Submission Rejected!')
   }
   console.log(SUBMISSION)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`SweetCode is listening on port ${port} <3`)
})
