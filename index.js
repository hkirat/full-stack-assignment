const express = require('express')
const bcrypt = require('bcrypt')

const app = express()
const port = 3001
app.use(express.json())


//models
class User {
  constructor(email, password, isAdmin) {
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}


//object stores
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

];


//api's
app.post('/signup', async (req, res) => {
  try {
    const { email, password, isAdmin = false } = req.body;

    // Check whether the body has email and password 
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Check if user with this email already exists
    const existingUser =  await USERS.find(user => user.email === email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user object and save to database
    const newUser = new User( email,hashedPassword ,isAdmin );
    USERS.push(newUser);

    // Return success response
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

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