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

//In order to send json we have to use middleware
app.use(express.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let { username, email, password, type } = req.body;

  if (!username || !email || !password) {
    return res.status(401).send("Provide your details to proceed!");
  }
  // Type of user (ADMIN/USER) if nothing is given USER is taken as default
  type = !type ? "USER" : type;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const queryUser = USERS.find((user) => user.email === email);

  if (queryUser) {
    // If the user already exists, return an error response
    return res
      .status(400)
      .json({ message: "User with this email already exists." });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({ username, email, password, type });

  // return back 200 status code to the client
  res.status(200).json({ message: "Signup successful!" });
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send('"email" or "password" field is missing for authentication');
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const queryUser = USERS.find((user) => user.email === email);
  if (!queryUser) {
    return res.status(401).json({ message: "User not found." });
  }


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (password === queryUser.password) {
    const token = Math.random().toString(36).substring(2);
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Incorrect password." });
  }


})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  const allQuestoins = QUESTIONS;
  res.json(QUESTIONS);

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const { email, problemID } = req.body;

  const userSubmissions = SUBMISSION.filter(
    (submission) =>
      submission.email === email && submission.problemID === problemID
  );

  res.status(200).json({ submission: userSubmissions });

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