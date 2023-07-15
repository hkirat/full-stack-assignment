const express = require('express')
const app = express()
const port = 3001
const fs = require("fs");

// setting up middlewares
app.use(express.json());

// We'll use files to store data, for it to be persistent
// const USERS = [];

// const QUESTIONS = [{
//     title: "Two states",
//     description: "Given an array , return the maximum of the array?",
//     testCases: [{
//         input: "[1,2,3,4,5]",
//         output: "5"
//     }]
// }];

// const SUBMISSION = [
// ]

const users = JSON.parse(
  fs.readFileSync(__dirname + "/database/users.json", "utf-8")
);

function handleSignup(email, password) {
  users.push({
    email: email,
    password: password,
  });
  fs.writeFile(
    __dirname + "/database/users.json",
    JSON.stringify(users),
    (err) => {
      if (err) {
        console.log("handleSignup error: ", err);
      }
    }
  );
}


function validateEmail(email) {
  if (email.length < 11) {
    return false;
  }
  const domain = email.split("@")[1];
  return domain === "gmail.com";
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (validateEmail(email) === false){
    return res.json({email: email, message:"Invalid email"});
  }
  //Store email and password (only if the user with the given email doesnt exist)
  const isNewUser = users.findIndex((user) => user.email === email);

  if (isNewUser === -1) {
    handleSignup(email, password);
    res.json({ message: "User signed successfully" });
  } else {
    res.status(409).json({ email: email, message: "User already exists" });
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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});