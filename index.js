// import {_allProblemsInfo} from './problems.js';
// import {USERS} from './userInfo.js';
// import {SUBMISSIONS} from './submissions.js';

const { USERS } = require('./userInfo.js');
const { _allProblems } = require('./problemList.js');
const { SUBMISSIONS } = require('./submissionsList.js');

const express = require('express');
const { Route } = require('react-router-dom');
const app = express()
const port = 3001

// const QUESTIONS = [{
//     title: "Two states",
//     description: "Given an array , return the maximum of the array?",
//     testCases: [{
//         input: "[1,2,3,4,5]",
//         output: "5"
//     }]
// }];

function checkUserExists(email) {
  const user = USERS[email];
  if(user)
    return true;
  else
    return false;
}

function verifyLogin(email, password) { /// this function does all the functionalites mentioned in LogIN
  // Retrieve the user object by email
  const user = USERS[email];
  
  // Check if the provided password matches the stored password
  if (user.password === password) {
    console.log("Login Successful !");
    return true;
  } else {
    console.log("Password is incorrect");
    return false;
  }

}


app.get('/signup', function(req, res) {
  // Add logic to decode body
  const { email, password } = req.query;
  // body should have email and password
  if(!email || !password) {
    res.status(400).send('Email and Password are required. You can try /signup?email=bharath&password=bharath');
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(checkUserExists(email)) {
    res.status(400).send('User already exists');
  }
  else{
    USERS[email] = {password: password, role: 'user'};
    res.status(200).send(`Hi ${email}, Your account created successfully`);
  }
  // return back 200 status code to the client
})

app.get('/login', (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).send('Email and Password are required. You can try /login?email=bharath&password=bharath');
  }

  if (USERS[email]) {
    if (USERS[email].password === password) {
      res.status(200).send(`Hi ${email}! Login Successful. `);
    } else {
      res.status(400).send('Password did not match');
    }
  } else {
    res.status(400).send('User Not Found');
  }
});

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

app.get('/problems', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(_allProblems);
})

app.get('/submissions', (req, res) => {
  const { title } = req.query; // Access 'title' from query parameters
  if(!title)
  {
    res.status(404).json({ error: 'Title not Provided. Type /submissions?title=Two Sum      You can also try title=Add Two Numbers' });

  }
  if (!SUBMISSIONS[title]) {
    // Handle case where title is missing or not found
    res.status(404).json({ error: 'Title not found' });
  } else {
    // Respond with submissions for the requested title
    res.json(SUBMISSIONS[title]);
  }
});

app.post("/submissions", function(req, res) {
  const { title, user, code } = req.body;
  const status = Math.random() < 0.5 ? 'Rejected' : 'Accepted';

  if (!title || !user || !code) {
    return res.status(400).send('Title, Username and code are required');
  }
  SUBMISSIONS[title][user] = { code, status };
  return res.status(200).send('Submission successful');
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

});

app.get("/", function(req, res) {
  return res.json({ message: 'Hey Try these routes', Routes: ['/signup', '/login', '/problems', '/submissions'] });
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})