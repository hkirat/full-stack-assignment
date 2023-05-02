const express = require('express')
const app = express()
const port = 3000

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
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

const requestBody = JSON.parse(body);

const { email, password } = requestBody;

const existingUser = USERS.find(user => user.email === email);

if (!existingUser) {
  
  USERS.push({ email, password });

  
  res.status(200).send();
} else {
  
  res.status(400).send('User already exists');
}

  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const requestBody = JSON.parse(body);

  const { email, password } = requestBody;

  const existingUser = USERS.find(user => user.email === email);

  if(existingUser && existingUser.password === password) {

    res.status(200).json({token : 'random-token'});
  }

  return res.status(401).send('Invalid email or password');

})

app.get('/questions', function(req, res) {

  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  
  res.status(200).json(SUBMISSION);

});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   // Assume the request body is in a variable called 'body'


const requestBody = JSON.parse(body);

const { userId, problemId, solution } = requestBody;

const isAccepted = Math.random() < 0.5;

const newSubmission = {
  user: userId,
  problem: problemId,
  solution,
  accepted: isAccepted
};

SUBMISSION.push(newSubmission);

if (isAccepted) {
  res.status(200).send('Solution accepted');
} else {
  res.status(400).send('Solution rejected');
}
  
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', (req, res) => {
  
  if (!admins.includes(adminId)) {
    return res.status(401).send('Unauthorized');
  }

  const { name, description } = req.body;

  const newProblem = {
    id: problems.length + 1, 
    name,
    description
  };

  problems.push(newProblem);

  res.status(201).send('Problem added successfully');
});

// app.get("/", function(req,res){
//   res.send("Hello World")
// })

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})