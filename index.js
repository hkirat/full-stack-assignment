const express = require('express')
const validator = require('validator') // To validate email addresses
const cryptoRandomString = require('crypto-random-string') // To generate random auth tokens
const util  = require('./util')
const app = express()
const port = 3001

//Using express to read urlencoded data
//extended option determines whether to use in-built querystring or qs library to parse the data
//extended option is set to false that means in-build querystring will be used
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Using MAP for better performance
const USERS = new Map([
  ['jatin@gmail.com','password']
]);

const ADMIN = new Map([
  ['jatin@gmail.com', 'password']
]);

const QUESTIONS = new Map([
  [1,
    {
      title: "Two states",
      description: "Given an array , return the maximum of the array?",
      testCases: [{
          input: "[1,2,3,4,5]",
          output: "5"
      }]
    }
  ]
]);


const SUBMISSION = new Map([
  [1, [
        {
          userEmail: 'jatin@gmail.com',
          submissionDate: new Date("2022-03-25"),
          solution:'Some Text',
          accepted:true
        }
      ]
  ]
]);

const USER_AUTH_TOKENS = new Set([]);
const ADMIN_AUTH_TOKENS = new Set([]);

app.post('/signup', function(req, res) {
  console.log("****** /signup invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if email and password fields are present in the request body
  let email = req.body.email;
  let password = req.body.password;
  if(email === undefined || password === undefined){
    console.log("Request body doesn't contain the required fields");
    res.send("Request body doesn't contain the required fields\n It should contain both 'email' & 'password' fields");
    return;
  }

  // Check if the email address already exists in the USERS array
  if(USERS.has(email)){
    console.log("Email '"+email+"' already exists in our system.");
    res.send("An account with email '"+email+"' already exists.");
    return;
  }

  // Check if the email address is valid
  if(!validator.isEmail(email)){
    console.log("Email address '"+email+"' is invalid.")
    res.send("Email address invalid!");
    return;
  }

  // Check if the password is valid (at least 8 characters long & alpha numeric)
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
  console.log("****** /login invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if email and password fields are present in the request body
  let email = req.body.email;
  let password = req.body.password;
  if(email === undefined || password === undefined){
    console.log("Request body doesn't contain the required fields");
    res.send("Request body doesn't contain the required fields\n It should contain both 'email' & 'password' fields");
    return;
  }

  // Validate credentials
  if(USERS.has(email) && USERS.get(email) === password){
    console.log("Login Successful!");

    // Generate random string for auth token
    const token = cryptoRandomString({ length: 10 });
    USER_AUTH_TOKENS.add(token);

    const successMsg = {
      Message:'Login Successful!',
      Token: token
    };
    res.status(200)
      .set('Content-Type','application/json')
      .send(JSON.stringify(successMsg));
  }else{
    console.log("Invalid Credentials");
    res.status(401).send("Invalid Credentials");
  }

})

app.post('/admin/login', function(req, res){
  console.log("****** /admin/login invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if email and password fields are present in the request body
  let email = req.body.email;
  let password = req.body.password;
  if(email === undefined || password === undefined){
    console.log("Request body doesn't contain the required fields");
    res.send("Request body doesn't contain the required fields\n It should contain both 'email' & 'password' fields");
    return;
  }

  // Validate credentials
  if(ADMIN.has(email) && ADMIN.get(email) === password){
    console.log("Admin Login Successful!");

    // Generate random string for auth token
    const token = cryptoRandomString({ length: 10 });
    ADMIN_AUTH_TOKENS.add(token);

    const successMsg = {
      Message: 'Admin Login Successful!',
      Token: token
    };
    res.status(200)
      .set('Content-Type','application/json')
      .send(JSON.stringify(successMsg));
  }else{
    console.log("Invalid Credentials");
    res.status(401).send("Invalid Credentials");
  }
})

app.get('/questions', function(req, res) {
  res.status(200)
    .set('Content-Type','application/json')
    .send(JSON.stringify(QUESTIONS));
})

// url should pass a problemid paramter. For example, /submissions?problemid=1
app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  console.log("****** /submissions invoked *******");
  console.log("Request parameter: "+JSON.stringify(req.query));

  // Check if the problemid parameter is present in the request or not.
  let problemId = req.query.problemid;
  if(problemId === undefined){
    console.log("Problem Id not present in the request body.");
    res.send("Please provide problem id");
    return;
  }
  
  res.send(SUBMISSION.get(parseInt(problemId)));
});


app.post("/submissions", function(req, res) {
  console.log("****** /submissions (POST) invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  let problemId = req.body.id;
  let userEmail = req.body.useremail;
  let solution = req.body.solution;
  let accepted = Math.random() >= 0.5;

  // Check if the required fields are present in the request body
  if(problemId === undefined || userEmail === undefined || solution === undefined){
    console.log("Request body is missing the required fields");
    res.status(400).send("Request body is missing the required fields");
    return;
  }

  // Check if a question with the give problemid exists or not
  if(!QUESTIONS.has(problemId)){
    console.log("Question with problem Id = '"+problemId+"' doesn't exist");
    res.status(400).send("Question with problem Id = '"+problemId+"' doesn't exist");
    return;
  }

  // Check if a user with the given userEmail exists or not
  if(!USERS.has(userEmail)){
    console.log("User with Email Id = '"+userEmail+"' doesn't exist");
    res.status(400).send("User with Email Id = '"+userEmail+"' doesn't exist");
    return;
  }

  // Validation complete. Proceed to persist the submission
  if(!SUBMISSION.has(problemId)){
    SUBMISSION.push(problemId,[]);
  }

  SUBMISSION.get(problemId).push({
    userEmail: userEmail,
    submissionDate: new Date(),
    solution: solution,
    accepted: accepted
  });

  let responseMessage = accepted ? "Success!" : "Incorrect Solution";
  res.status(200).send(responseMessage);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})