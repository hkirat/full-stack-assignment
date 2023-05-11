const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3001

const bcryptjs = require("bcryptjs");

const USERS = [];
const ADMIN = ['admin1','admin2','admin3','moderator'];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res)=>{
  res.send(
    `
  <html>
    <body>
      <h1>Welcome to the Full-Stack Assignment!<h1>
    </body>
  </html>
  `);
})

const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const myuser = {
    "email":email,
    "password":password
  };
  const userExists = USERS.some(user => user.email === myuser.email);

  if(!userExists){console.log("Adding the user... Thank you for signing up!");
  USERS.push(myuser);
}
 else{
  console.log("User with the given email id already exists, please try logging in with this email.");
 }
  // return back 200 status code to the client
  res.status(200).json(myuser);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const myuser = {
    "email":email,
    "password":password
  };

  const userExists = USERS.filter(user => user.email === myuser.email);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(userExists && userExists.password === myuser.password){
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(myuser.password,salt);
      res.status(200).json({hash});
  }
  else{
    res.status(401).send("Authentication error...try using correct credentials");
  }
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  const userid = req.query.userid
  const probid = req.query.probid
   // return the users submissions for this problem

  const subs = SUBMISSION.filter(submission =>  {
    if (probid) {
      return submission.userid === userid && submission.probid === probid
    } else {
      return submission.userid === userid
    }
  })

  res.send(subs);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const userid = req.body.userid
   const probid = req.body.probid
   const sol = req.body.sol
 
   // Randomly accept or reject the solution (50/50 chance)
   const isAccepted = Math.random() > 0.5
 
   // Create a new submission object
   const sub = { userid, probid, sol, isAccepted, timestamp: new Date() }
 
   // Add the submission to the SUBMISSIONS array
   SUBMISSION.push(sub)
 
   // Return a response indicating whether the solution was accepted or rejected
   const status = isAccepted ? 'accepted' : 'rejected'
   res.send(`Your solution has been ${status}!`);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problems", function(req, res) {
  const userRole = req.body.role
  const problem = req.body.problem

  // Check if the user is an admin
  if (!ADMIN.includes(userRole)) {
    return res.status(401).send('Unauthorized')
  }

  // Add the problem to the PROBLEMS array
  PROBLEMS.push(problem)

res.status(200).send('Problem added successfully')
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})