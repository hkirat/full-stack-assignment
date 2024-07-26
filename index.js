const express = require('express')
const app = express()
const port = 3001

const USERS = [{}];

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
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body();

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userAvailable = USERS.find((user) => user.email === email);

  if(userAvailable){
    return res.status(400).send('User with email already exists');
  }
  // return back 200 status code to the client
  else{
    USERS.push({email, password});
    return res.status(200).send('User sign up successfull');
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body();

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const userAvailable = USERS.find((user) => user.email === email);

  // If the password is not the same, return back 401 status code to the client

  if(!userAvailable || userAvailable.password != password){
      return res.status(400).send('Email or password is Wrong');
  }

    // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = htwR23;
  return res.status(200).send(`Login successfull. token: ${token}`);
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array

  //will you json.stringify if needed
  const Allquestions = {};
  QUESTIONS.forEach((item) => {
    const attr = {
      title: item.title,
      description: item.description,
      testcase: item.testCases
    }
    
    Allquestions = {...Allquestions, attr};
  })
  
  return res.json(Allquestions);
})

// app.get("/submissions", function(req, res) {
//    // return the users submissions for this problem
//   res.send("Hello World from route 4!")
// });


// app.post("/submissions", function(req, res) {
//    // let the user submit a problem, randomly accept or reject the solution
//    // Store the submission in the SUBMISSION array above
//   res.send("Hello World from route 4!")
// });

// // leaving as hard todos
// // Create a route that lets an admin add a new problem
// // ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})