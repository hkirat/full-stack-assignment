const express = require('express')
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
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

//signup route
app.post('/signup', async (req, res) => {


  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

  try {
    const { email, password } = req.body;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user already exists
    const userExists = USERS.find((user) => user.email === email);
    if (userExists) {
      return res.status(409).send("User already exists");
    }

    // add the new user to the USERS array
    USERS.push({ email, password });

    res.status(200).send("Signup successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
  
});

// login route
app.post("/login", async (req, res) => {


  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const { email, password } = req.body;

  // find the user with the given email
  const user = USERS.find((user) => user.email === email);

  if (!user) {
    // if user is not found, return a 401 status code (Unauthorized)
    return res.status(401).send("Invalid email or password");
  }

  // check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    // if password is incorrect, return a 401 status code (Unauthorized)
    return res.status(401).send("Invalid email or password");
  }

  // if email and password are correct, create and send a JWT token
  const token = jwt.sign({ email }, "secret");
  res.status(200).json({ token });
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})