const express = require('express')
const validator = require('validator') // To validate email addresses
const randomstring = require('randomstring') // To generate random auth tokens
const util  = require('./util')
const app = express()
const port = 3001

app.use(express.json());

// User Credentials
// Using MAP for better performance
const USERS = new Map([
  ['jatin@gmail.com','password']
]);

// Admin credentials.
// Using MAP for better performance
const ADMIN = new Map([
  ['jatin@gmail.com', 'password']
]);

let nextQuestionId = 2; // To keep the question ids unique

// map key is question id
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


// map key is question id
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

// Store tokens for loggedin users
const USER_AUTH_TOKENS = new Set();
const ADMIN_AUTH_TOKENS = new Set();



/* Request body example:
{
  "email":"jatin@gmail.com",
  "password":"password"
} 
*/
app.post('/signup', function(req, res) {
  console.log("****** /signup invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if email and password fields are present in the request body
  let email = req.body.email;
  let password = req.body.password;
  if(email === undefined || password === undefined){
    console.log("Request body doesn't contain the required fields");
    res.status(400).send("Request body doesn't contain the required fields\n It should contain both 'email' & 'password' fields");
    return;
  }

  // Check if the email address already exists in the USERS array
  if(USERS.has(email)){
    console.log("Email '"+email+"' already exists in our system.");
    res.status(409).send("An account with email '"+email+"' already exists.");
    return;
  }

  // Check if the email address is valid
  if(!validator.isEmail(email)){
    console.log("Email address '"+email+"' is invalid.")
    res.status(400).send("Email address invalid!");
    return;
  }

  // Check if the password is valid (at least 8 characters long & alpha numeric)
  if(!util.passwordIsValid(password)){
    console.log("Invalid password '"+password+"'");
    res.status(422).send("Password should be atleast 8 characters long and should only contain alpha numeric characters");
    return;
  }

  // Add the credentials to the USERS array
  USERS.set(email, password);
  console.log("The credentials "+JSON.stringify(req.body)+" have been added to the USERS array");
  console.log("USERS array : "+JSON.stringify(USERS));

  // Return success response along with 200 status code
  res.status(200).send("SignUp successful!");
})



/* Request body example:
{
  "email":"jatin@gmail.com",
  "password":"password"
} 
*/
app.post('/login', function(req, res) {
  console.log("****** /login invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if email and password fields are present in the request body
  let email = req.body.email;
  let password = req.body.password;
  if(email === undefined || password === undefined){
    console.log("Request body doesn't contain the required fields");
    res.status(400).send("Request body doesn't contain the required fields\n It should contain both 'email' & 'password' fields");
    return;
  }

  // Validate credentials
  if(USERS.has(email) && USERS.get(email) === password){
    console.log("Login Successful!");

    // Generate random string for auth token
    const token = randomstring.generate(10);
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



/* Request body example:
{
  "email":"jatin@gmail.com",
  "password":"password"
} 
*/
app.post('/admin/login', function(req, res){
  console.log("****** /admin/login invoked *******");
  console.log("Request body: "+JSON.stringify(req.body));

  // Check if email and password fields are present in the request body
  let email = req.body.email;
  let password = req.body.password;
  if(email === undefined || password === undefined){
    console.log("Request body doesn't contain the required fields");
    res.status(400).send("Request body doesn't contain the required fields\n It should contain both 'email' & 'password' fields");
    return;
  }

  // Validate credentials
  if(ADMIN.has(email) && ADMIN.get(email) === password){
    console.log("Admin Login Successful!");

    // Generate random string for auth token
    const token = randomstring.generate(10);
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
  console.log("****** /questions invoked *******");

  res.status(200)
    .set('Content-Type','application/json')
    .send(Array.from(QUESTIONS));
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
    res.status(400).send("Please provide problem id");
    return;
  }
  
  res.status(200).send(SUBMISSION.get(parseInt(problemId)));
});



/* Request body example:
{
  "id":"1",
  "solution":"blah",
  "useremail":"jatin@gmail.com"
} 
*/
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

  problemId = parseInt(problemId); // convert this into integer since QUESTIONS is using integer type for id

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
    SUBMISSION.set(problemId,[]);
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



/* Request body example:
{
  "title": "N QUEENS",
  "description": "Given an array , return the maximum of the array?",
  "testCases": [{
      "input": "[1,2,3,4,5]",
      "output": "5"
  }]
} 
*/
app.post('/questions', function(req, res) {
  console.log("****** /questions (POST) invoked *******");
  console.log("Request headers: "+JSON.stringify(req.headers));
  console.log("Request body: "+JSON.stringify(req.body));
  

  // Authenticate the admin user
  let authToken = req.headers.authtoken;
  if(authToken === undefined || !ADMIN_AUTH_TOKENS.has(authToken)){
    console.log("Authentication failed");
    res.set(400).send("Authentication failed");
    return;
  }

  let title = req.body.title;
  let description = req.body.description;
  let testCases = req.body.testCases;
  // Check if the required fields are present in the request body
  if(title === undefined || description === undefined || testCases === undefined){
    console.log("Request body is missing the required parameters");
    res.set(400).send("Request body is missing the required parameters");
    return;
  }

  // Check if this question already exists
  for(let [key,value] of QUESTIONS){
    if(value.title === title){
      console.log("This question already exists");
      res.set(400).send("This question already exists");
      return;
    }
  }

  // Proceed to add the question
  QUESTIONS.set(nextQuestionId,{
    title: title,
    description: description,
    testCases: testCases
  });

  nextQuestionId++; // increment for the next question

  console.log("A new question has been added");
  res.status(200).send("Thanks for submitting a new question");
})


// Needs authtoken field in the header.
// We will get the authtoken after login
app.post('/logout', function(req, res){
  console.log("****** /logout invoked *******");
  console.log("Request headers: "+JSON.stringify(req.headers));

  let authToken = req.headers.authtoken;
  // Check if the user is logged in or not.
  if(authToken === undefined || !(USER_AUTH_TOKENS.has(authToken) || ADMIN_AUTH_TOKENS.has(authToken))){
    console.log("User not logged in");
    res.status(400).send("User not logged in");
    return;
  }

  // Delete the tokes from the required set
  let logoutSuccessful = USER_AUTH_TOKENS.delete(authToken) || ADMIN_AUTH_TOKENS.delete(authToken);
  console.log("User logged out successfully");
  res.status(200).send("Logout successful!");
})


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})