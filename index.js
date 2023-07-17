const express = require('express')
const app = express()
const port = 3001
const fs = require("fs");
const cors = require("cors");

// setting up middlewares
app.use(express.json());
app.use(cors());

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

function decryptToken(token){
  const decryptedKeys = { '@': 'a', '!': 'b', '#': 'c', '$': 'd', '%': 'e', '&': 'f', '*': 'g', '(': 'h', ')': 'i', '1': 'j', '2': 'k', '3': 'l', '4': 'm', '5': 'n', '6': 'o', '7': 'p', '8': 'q', '9': 'r', '0': 's', a: 't', b: 'u', c: 'v', d: 'w', e: 'x', f: 'y', g: 'z', h: '0', i: '1', j: '2', k: '3', l: '4', m: '5', n: '6', o: '7', p: '8', q: '9', '=': '@', '-': '.' };

  let email = "";
  for (let i=0; i<token.length; i++){
    email += decryptedKeys[token[i]];
  }

  return email;
}

// middleware function to authenticate user 
function authenticateUser(req, res, next){
  const { token } = req.headers;

  if (!token){
    return res.status(403).json({message: "Not authorised"})
  }

  const email = decryptToken(token);

  if (!validateEmail(email)){
    return res.status(403).json({message: "Not authorised"})
  }

  const userIndex = users.findIndex((user) => user.email === email);
  if (userIndex === -1){
    return res.status(403).json({message: "Not authorised"})
  }

  req.user = users[userIndex];
  next();
}


function handleSignup(email, password) {
  users.push({
    email: email,
    password: password,
    submissions: []
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


function getToken(email) {
  let token = "";

  // vulnerable - can be decrypted by trial and error with the email and token
  const encryptedKeys = { a: '@', b: '!', c: '#', d: '$', e: '%', f: '&', g: '*', h: '(', i: ')', j: '1', k: '2', l: '3', m: '4', n: '5', o: '6', p: '7', q: '8', r: '9', s: '0', t: 'a', u: 'b', v: 'c', w: 'd', x: 'e', y: 'f', z: 'g', 0: 'h', 1: 'i', 2: 'j', 3: 'k', 4: 'l', 5: 'm', 6: 'n', 7: 'o', 8: 'p', 9: 'q', '@': '=', '.':'-'};

  for (let i = 0; i < email.length; i++) {
    token += encryptedKeys[email[i]];
  }

  return token;
}

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (validateEmail(email) === false) {
    return res.status(403).json({ email: email, message: "Invalid email" });
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

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (validateEmail(email) === false) {
    return res.json({ email: email, message: "Invalid email" });
  }

  // Check if the user with the given email exists in the USERS array
  const userIndex = users.findIndex((user) => user.email === email);

  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token
  // If the password is not the same, return back 401 status code to the client
  if (userIndex !== -1) {
    if (password === users[userIndex].password) {
      res.json({
        token: getToken(email),
        message: "User logged successfully",
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});


app.get("/questions", function (req, res) {
  const questions = JSON.parse(
    fs.readFileSync(__dirname + "/database/questions.json", "utf-8")
  );

  const problemId = parseInt(req.query.problemId);
  if (problemId) {
    // return particular question
    const problemIndex = questions.findIndex((p) => p.id === problemId);
    if (problemIndex === -1) {
      res.status(404).json({ message: "Question not found" });
    } else {
      res.json({ question: questions[problemIndex] });
    }
  } else {
    //return the user all the questions in the QUESTIONS array
    res.json({ questions: questions });
  }
});

app.get("/submissions", authenticateUser, function(req, res) {
   // return the users submissions for this problem
  res.json(req.user.submissions)
});


// for submission of a problem we should add post request for that on the questions route itself
app.post("/questions", authenticateUser, (req, res) => {

  const id = parseInt(req.query.problemId);

  if (!id){
    res.status(404).json({ message: "Question not found" });
  } else {
      const questions = JSON.parse(
        fs.readFileSync(__dirname + "/database/questions.json", "utf-8")
      );
      const problemIndex = questions.findIndex((p) => p.id === id);
      if (problemIndex === -1) {
        res.status(404).json({ message: "Question not found" });
      } else {
      const submission = {
        problemId: id,
        language: req.body.language,
        code: req.body.code
      };

      req.user.submissions.push(submission);
      fs.writeFile(__dirname+"/database/users.json", JSON.stringify(users), "utf-8", (err) => {
        if (err){
          console.log("Error at Problem Submission: ", err);
        }
      })
      res.json({ message: "Successfully submitted" });
    }
  }
})
// app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
//   res.send("Hello World from route 4!")
// });

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});