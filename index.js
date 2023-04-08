const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const e = require('express');
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [{
    question: "Two States",
    userEmail : "abcd",
    verdict : "AC"
  }
];

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  for(user of USERS){
    if(user.email == email){
      return res.status(401).json({
        success: false,
        response: "Email already registered"
      });
    }
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({email,password});
  console.log(USERS);
  // return back 200 status code to the client
   return res.status(200).json({
    success:true,
    message: "Successfully registered"
  });

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let isAvailable = false;
  for(user of USERS){
    if(user.email == email){
      if(user.password != password){
        return res.status(400).json({
          success:false,
          message:"invalid email/password"
        });
      }
      isAvailable=true;
    }
  }

  if(!isAvailable){
    return res.status(401).json({
      success:false,
      message:"Email not registered"
    });
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = Math.random().toString(36).substring(2,7);
  console.log(token);
  return res.status(200).json({
    success:true,
    token: token,
    message: "successfully logged in"
  });
  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  return res.status(200).json({
    success: true,
    response: QUESTIONS
  });
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const email = req.body.email;
  let userSubmissions = [];
  for(submission of SUBMISSION){
    if(submission.userEmail == email){
      userSubmissions.push(submission);
    }
  }
  return res.status(200).json({
    success:true,
    response: userSubmissions,
    message:"succesfully fetched all the submissions"
  });
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const email = req.body.email;
  const question = req.body.question;
  const options = ['AC', 'WA'];
  const choice = Math.random();
  submission.push({
    question: question,
    userEmail: email,
    verdict: options[choice]
  });
  
  return res.status(200).json({
    success:true,
    message: "Succesfully submitted the solution",
    response: options[choice]
  });

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
