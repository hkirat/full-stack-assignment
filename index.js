const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS = [];
const ADMINS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Array Sum",
    description: "Given an array, return the sum of its elements",
    testCases:[
      {
      input: "[1,2,3,4]",
      output: "10"
      }
    ]
  }
];


const SUBMISSION = [
  {
    question: "Two states",
    submissions: [
      {
        code: "print('Hello World')",
        verdict: "Wrong Answer"
      }
    ]
  }
]

app.get('/',(req,res) => {
  res.send("Hello World")
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let email=req.body.email;
  let password=req.body.password;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  const emailExists = USERS.some(user => user.email === email );
  if(emailExists){
    res.status(401).send("User already exist");
  }else{
    USERS.push({
      email: email,
      password: password
    })
    res.status(200).send("User successfully added");
  }
  
  
 
  
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let email=req.body.email;
  let password=req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const user = USERS.find(user => user.email === email);
  if(user){
    if(user.password===password){
      res.status(200).send("Valid Login");
    }else{
      res.status(401).send("Wrong password");
    }
  }else{
    res.status(401).send("User doesn't exist");
  }

  //res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  
  const question=req.body.question
  // check if submissions for the problem exist
  const submission = SUBMISSION.find(submissions => submissions.question === question);
  if(submission){
    res.status(200).send(submission)
  }else{
    res.status(401).send("No submissions for this problem")
  }
  
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const question=req.body.question
  const code=req.body.code

  const randomNumber = Math.floor(Math.random() * 2) + 1; //generates either 1 or 2
  let verdict="Wrong Answer"
  if (randomNumber==1)verdict="Accepted"

  const submission = SUBMISSION.find(submissions => submissions.question === question);
  
  if(submission){
    submission.submissions.push({
      code: code,
      verdict: verdict
    })
  }else{
    SUBMISSION.push(
      {
        question: question,
        submissions: [
          {
            code: code,
            verdict: verdict
          }
        ]
      }
    )
  }

  res.status(200).send(verdict)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

//admin signup
app.post('/admin-signup', function(req, res) {
  let email=req.body.email;
  let password=req.body.password;

  //Store email and password (as is for now) in the ADMINS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  const emailExists = ADMINS.some(admin => admin.email === email );
  if(emailExists){
    res.status(401).send("Admin already exist");
  }else{
    ADMINS.push({
      email: email,
      password: password
    })
    res.status(200).send("Admin successfully added");
  }
  
})

//admin login
app.post('/admin-login', function(req, res) {
  let email=req.body.email;
  let password=req.body.password;

  // Check if the admin with the given email exists in the ADMINS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const admin = ADMINS.find(admin => admin.email === email);
  if(admin){
    if(admin.password===password){
      res.status(200).send("Valid Login");
    }else{
      res.status(401).send("Wrong password");
    }
  }else{
    res.status(401).send("Admin doesn't exist");
  }

  //res.send('Hello World from route 2!')
})

app.post('/create',(req,res) => {
  const email=req.body.email
  const password=req.body.password

  const admin = ADMINS.find(admin => admin.email === email);
  if(admin){
    if(admin.password===password){
      QUESTIONS.push(
        {
          title: req.body.title,
          description: req.body.description,
          testCases: {
            input: req.body.input,
            output: req.body.output
          }
        }
      )
      res.status(200).send("Successfully added");
    }else{
      res.status(401).send("Wrong password. Invalid Login");
    }
  }else{
    res.status(401).send("Not an Admin");
  }
})

app.post('/',(req,res) => {
  console.log(req.body)
  res.send("Done")
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})