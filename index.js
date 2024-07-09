const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const USERS = [];

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

let currentUserRole = "";

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  
  if(!email || !password || !role) {
    return res.status(400).json({msg: "Enter email, password and role"});
  }

  for(let i = 0; i<USERS.length; i++) {
	  if(USERS[i].email == email) {
		  return res.status(409).json({msg: "User already exists"});
	  }
  }
  
  USERS.push({email, password, role});

  res.status(200).json({msg: "User registered"});
  // return back 200 status code to the client
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const email = req.body.email;
  const password = req.body.password;

   if(!email || !password) {
    return res.status(400).json({msg: "Enter email and password"});
  } 
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  for(let i = 0; i<USERS.length; i++) {
	  if(USERS[i].email == email && USERS[i].password == password) {
      currentUserRole = USERS[i].role;
		  return res.status(200).json({msg: "User successfully logged in!"});
	  }
  }
  
  res.status(401).json({msg: "Incorrect email or password entered"});

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  const questions = QUESTIONS.map(question => question.title);
  res.status(200).json(questions);

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const problem = req.body.problem;
  const submissions = SUBMISSION.filter(submission => submission.problem == problem);
  

  if(submissions.length == 0) {
    return res.status(400).json({msg: "No submissions have been made for this question"});
  }

  res.status(200).json(submissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const problem = req.body.problem;
  if(QUESTIONS.some(question => question.title === problem) == false) {
    return res.status(400).json({msg: "No such question is present"});
  }

  let status = Math.floor(Math.random() * 2);
  if(status === 1) {
    status = "Accepted";
  }
  else {
    status = "Rejected";
  }
  
  SUBMISSION.push({problem, status});
  res.status(200).json({msg: "Problem successfully submitted!"});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", function(req, res) {
  if(currentUserRole != "admin") {
    return res.status(401).json({msg: "Only admins can add questions"});
  }

  const title = req.body.title;
  const description = req.body.description;
  const testCases = req.body.testCases;

  if(!title || !description || !testCases) {
    return res.status(400).json({msg: "Please enter title, description and test-cases for the question"});
  }

  if(QUESTIONS.some(question => question.title === title)) {
    return res.status(409).json({msg: "Question already exists"});
  }

  QUESTIONS.push({title, description, testCases});
  res.status(200).json({msg: "Question successfully submitted"});
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})