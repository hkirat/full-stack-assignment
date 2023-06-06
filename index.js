const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
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


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const userEmail = req.body.email;
  const userPassword = req.body.password;


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let userExists = USERS.some(user => user.email === userEmail);

  if(userExists){
    res.status(409).send("User already exists")
  }else{
    USERS.push({email: userEmail, password: userPassword});
    res.status(200).send("User Successfully added");
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const {userEmail, userPassword} = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let userExists = USERS.some(user => user.email === userEmail);

  if(userExists){
      if(userExists.password === userPassword){
        const token = jwt.sign({email: userEmail}, "Some_Key")
        res.status(200).send(token);
      }else{
        res.status(401).send("Password mismatch")
      }
  }else{
    res.status(401).send("User Not Found")
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  let ques = [];

  QUESTIONS.forEach((e) => {
    ques.push(e.title)
  })

  res.status(200).send(ques)

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem

   const token = req.headers.authorization;

   if(!token) {
    res.status(401).send("Unauthorized");
   }

   jwt.verify(token, "Some_key", (err, decoded) => {
    if(err){
      res.status(401).send("Please Login")
      return
    }

    const userID = decoded.userEmail;

    const questionID = req.params.questionID;

    const userSubmissions = SUBMISSION.filter(
      submission => submission.userEmail === userID && submission.questionID === questionID
    );

    res.status(200).send(userSubmissions)
   })   
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   const token = req.headers.authorization;

   if(!token) {
    res.status(401).send("Unauthorized")
   }

   jwt.verify(token, "Some_key", (err, decoded) => {
    if(err){
      res.status(401).send("Please Sign in to Submit the Solution");
      return;
    }

    const submission = req.body;

    const isAccepted = Math.random() > 0.5;

    const status = isAccepted ? "Accepted" : "Rejected";

    submission.status = status;

    SUBMISSION.push(submission);

    res.status(200);
   })

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addQuestion", (req, res) => {
  const token = req.headers.authorization;

   if(!token) {
    res.status(401).send("Unauthorized")
   }

  jwt.verify(token, 'Some_key', (err, decoded) => {
  if (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }

  const isAdmin = decoded.isAdmin; // Assuming isAdmin is a property in the decoded token

  if (!isAdmin) {
    res.status(403).json({ message: 'Forbidden: User is not an admin' });
    return;
  }

  // Proceed with adding the new problem
  const newProblem = req.body; // Assuming the new problem details are available in the request body
  QUESTIONS.push(newProblem);

  res.status(200).json({ message: 'Problem added successfully' });
  });
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})