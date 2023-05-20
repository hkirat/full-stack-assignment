const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = 5000
app.use(express.json())
app.use(bodyParser.urlencoded({extended : false}))
const USERS = [
  {
    email : "random@gmail.com",
    password : "random"
  }
];
const ADMIN = [
  {
    email : "admin@gmail.com",
    password : "admin"
  }
]
const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    }
];


const SUBMISSION = [
  {
    questionId : 1,
    questionDescription : "Given an array , return the maximum of the array?",
    questionTitle : "Two Sates",
    solution : "Solution Here"
  }

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some(user => user.email === userEmail);
  if(!userExists){
    
    USERS.push({email : userEmail,password: userPassword});
    res.status(200).send("User is Created Successfully");
  }
  else{
    return res.status(400).send("User with this email already exists");
  }
  
  // return back 200 status code to the client
  
})

app.post('/login', function(req, res) {
  //* function for generating random string
  function generateRandomString(length) {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = "";
  
    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    
    return randomString;
  }
  const randomString = generateRandomString(64);
  // Add logic to decode body
  // body should have email and password
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userFound = USERS.some(user => user.email === userEmail);
  const userPasswordIsSame = USERS.some(user => user.password === userPassword)
  if(!userFound){
    return res.status(200).send("user doesn't exist woth this email, sign up")
  }
  if(userFound && userPasswordIsSame){
    return res.status(200).send(randomString);
  }
  if(userFound && !userPasswordIsSame){
    return res.status(401).send("Password is incorrrect");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const {questionId, questionTitle, questionDescription, solution} = req.body;
  SUBMISSION.push({questionId : questionId, questionTitle : questionTitle, questionDescription : questionDescription, solution : solution});
  
  if(Math.random() < 0.5) {
  res.send("Correct Submission");
  }
  else{
    res.send("Incorrect Submission");
  }
  
  
});

//TODO leaving as hard todos
// Create a route that lets an admin add a new problem
app.post("/adminsignup", (req,res)=>{
  const adminEmail = req.body.email;
  const adminPassword = req.body.password;

  const adminExist = ADMIN.some(admin => admin.email === adminEmail);
  if (adminExist) {
    return res.status(400).send("Admin with the same email already exists.");
  }
  else{
  ADMIN.push({email : adminEmail, password : adminPassword});
  return res.status(200).send("Added Admin");
  }
})
// ensure that only admins can do that.

app.post("/admin/addquestions", (req,res)=>{
  const {email, questions} = req.body;
  const isAdmin = ADMIN.some(admin => admin.email === email);
  if(!isAdmin){
   return res.status(400).send("You're not an Admin");
  }
  else{
    QUESTIONS.push(question);
    return res.status(200).send("Question added successfully");
  }
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})