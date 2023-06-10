const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
const base64 = require('base-64');

app.use(bodyParser.json());


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

app.post('/signup', function(req, res) {
  const { body } = req.body;

  if (body) {
    const decodedBody = base64.decode(body);
    let email = null;
    let password = null;
  // Add logic to decode body
  // body should have email and password
  
    decodedBody.split('\n').forEach(line => {
      if (line.startsWith('Email:')) {
        email = line.split(':')[1].trim();
      } else if (line.startsWith('Password:')) {
        password = line.split(':')[1].trim();
      }
    });

    if (email && password) {
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
      const user = {
        email: email,
        password: password
      };
  
      USERS.push(user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'User registered successfully.' }));
   
       return res.send('Sign up successful');
  }
  }



  return res.send('Invalid request');

  
})

app.post('/login', function(req, res) {
    const { body } = req.body;
  if (body) {
    // Add logic to decode body
  // body should have email and password

    const decodedBody = base64.decode(body);
    let email = null;
    let password = null;

    decodedBody.split('\n').forEach(line => {
      if (line.startsWith('Email:')) {
        email = line.split(':')[1].trim();
      } else if (line.startsWith('Password:')) {
        password = line.split(':')[1].trim();
      }
    });
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

    if (email && password) {
      return res.send('Login successful');
    }
  }

  return res.send('Invalid request');

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {
 return res.json(QUESTIONS);
  //return the user all the questions in the QUESTIONS array
})

app.get("/submissions", function(req, res) {
  return res.json(SUBMISSION); 
  // return the users submissions for this problem
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { body } = req.body;
   if (body) {
     const decodedBody = base64.decode(body);
     let problem = null;

     decodedBody.split('\n').forEach(line => {
      if (line.startsWith('Problem:')) {
        problem = line.split(':')[1].trim();
      }
    })
  }

    if (problem) {
      const solutionAccepted = Math.random() < 0.5; // Randomly accept or reject the solution
      const submission = {
        problem,
        solutionAccepted,
      };
    

      SUBMISSION.push(submission);
      return res.json(SUBMISSION); 
    }
   
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})