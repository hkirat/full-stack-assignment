const express = require('express')
const app = express()
const port = 3001

const USERS = [];
const adminEmail = "xyz@gmail.com"
const adminPass = "abc"

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = []

// Middleware to parse request body
app.use(bodyParser.json());

const addUser = (email, password) => {
  // Create an object to represent the user
  const user = {
    email: email,
    password: password
  };

  // Add the user object to the USERS array
  USERS.push(user);
};

const isAdmin = (email, password) => {
  // Loop through the array and check if the email exists
  if (email === adminEmail && password === adminPass) {
    return true;
  } else {
    return false;
  }
};

const userExists = (email, password) => {
  // Loop through the array and check if the email exists
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email && USERS[i].password === password) {
      return true;
    }
  }
  // Return false if the email is not found
  return false;
};

const emailIsThere = (email) => {
  // Loop through the array and check if the email exists
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email) {
      return true;
    }
  }

  // Return false if the email is not found
  return false;
};

//signup done!

app.post('/signup', function (req, res) {
  const data = req.body()

  const emailExists = userExists(data.email)

  if (emailExists) {
    res.status(401).json({ message: 'Invalid credentials' });
  } else {
    addUser(data.email, data.password)
    res.status(200).json({ message: 'Login successful' });
  }

  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client
  res.send('Hello World!')
})

app.post('/login', function (req, res) {
  const data = req.body()
  const emailExists = emailIsThere(data.email)
  const userInfo = userExists(data.email, data.password)

  if (userInfo) {
    const token = "jfbaojfoaf"
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }

  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.send('Hello World from route 2!')
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
  res.send("Hello World from route 3!")
})

app.get("/submissions", function (req, res) {
  // return the USERS submissions for this problem
  res.json(SUBMISSION)
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
app.post('/newProblems', (req, res) => {
  // Create a new feature based on the data in the request body

  const data = req.body()

  const isAdmin = isAdmin(req.body().email, req.body().password)

  if (isAdmin) {
    const newFeature = {
      title: data.title,
      description: data.description,
      testCases: data.testCases,
    };

    QUESTIONS.push(newFeature)

    res.status(201).json({ message: 'Feature added successfully', feature: newFeature });
  } else {
    res.status(401).json({ message: 'Invalid credentials'});
  }
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})