const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
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

  const {email, password} = req.body
  
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  
  const existingUser = USERS.find((user) => user.email === email)

  if(existingUser){
    res.status(400).json({error: 'Email already in use'})
    return
  }

  const newUser = {email, password}
  USERS.push(newUser)
  console.log(USERS)
  res.status(200).json({message: 'User created successful'})

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body
  // body should have email and password
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const existingUser = USERS.find((user) => user.email === email)

  if(existingUser){
    const token = jwt.sign({ email }, 'secret-key', { expiresIn: '1h' });
    existingUser.password === password 
    ?res.status(200).json({token})
    :res.status(401).json({message: "password doesn't match"})
    return
  }

  res.status(401).json({error: "unauthorized"})


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  return res.status(200).send(QUESTIONS)
})

app.get("/submissions", function(req, res) {

  try{
  const token = req.headers.authorization.split(' ')[1]

  const decode = jwt.verify(token, 'secret-key')
  
  res.status(200).send(SUBMISSION)
  }
  catch (err){
    console.log(err)
    res.status(401).send({error: "unauthorized"})
  }
});


app.post("/submissions", function(req, res) {
  const accepted = Math.random() >= 0.5;
  
  // Store the submission in the SUBMISSION array
  SUBMISSION.push(req.body);

  // Send a response indicating whether the submission was accepted or rejected
  if (accepted) {
    res.status(200).send("Solution accepted");
  } else {
    res.status(403).send("Solution rejected");
  }
  
});

app.post("/problems", function(req, res) {
  // Get the token from the authorization header
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, 'secret-key');

    // Check if the user is an admin
    if (decoded.role !== "admin") {
      // If not an admin, return a 401 Unauthorized error
      return res.status(401).json({ error: "You are not authorized to access this resource." });
    }

    // If the user is an admin, add the new problem to the database
    // ...

    // Return a success message
    return res.status(200).json({ message: "Problem added successfully." });

  } catch (err) {
    // If the token is invalid or verification fails, return a 401 Unauthorized error
    return res.status(401).json({ error: "Invalid token." });
  }
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})