const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //use body - parsers to get req.body

const USERS = [];

app.post('/signup', function (req, res) {

  const { email = null, password = null } = req.body;
  if (!(email && password)) {
    throw new Error("Please Fill The Details")
  }

  if (!USERS.find(user => user.email === email)) {
    USERS.push({
      email,
      password
    })
  } else {
    throw new Error("User already exists Please Login")
  }

  res.status(201).send('User Created Successfully')

})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email = null, password = null } = req.body;
  if (!(email && password)) {
    throw new Error('Invalid email or password')
  }

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  // Also ensure that the password is the same
  if (user && user.password === password) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(201).json({ token: 'eyJhbGcPrzScxHb7SR6sAOMRckfFwi4rp7o' });
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).json({ error: 'Invalid email or password' });
  }
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})