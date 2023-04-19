const express = require('express')
const app = express()
const port = 3001
const crypto = require("crypto");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const USERS = [{ email: "example@example.com", password: "password123" , admin: true}];

var QUESTIONS = [{
    questionid : "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {
    questionid: "1",
    user_email: "abc@gmail.com",
    code: "",
    status:""
  }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  console.log(req.body); // add this line to check if req.body is defined

  const email = req.body.email;
  const password = req.body.password;
  const admin = false;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  //For Later when we can use the hashed Password
  //const salt = crypto.randomBytes(16).toString("hex");
  //const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const emailExists = USERS.some((user) => user.includes(email));
  if (emailExists) {
    res.status(400).json({ message: "Email already exists!!" });
  }

  // return back 200 status code to the client
  else {
    USERS.push([email, password, admin]);
    res.status(200).json({ message: "Successfully Signed Up!" });
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  //For Later when we can use the hashed Password
  //const salt = crypto.randomBytes(16).toString("hex");


  // Check if the user with the given email exists in the USERS array
   const emailExists = USERS.some((user) => user.email === email);
   if (!emailExists) {
     res.status(400).json({ message: "Email doesn't exist!!" });
   }
  // Also ensure that the password is the same
   else{
     const user = USERS.find((user) => user.email === email);
     const actual_password = user.password;
     // If the password is the same, return back 200 status code to the client
     // Also send back a token (any random string will do for now)
     if (actual_password === password) {
       res
         .status(200)
         .json({ message: "Login successful!", token: "random string" });
     }
     else{
       // If the password is not the same, return back 401 status code to the client
       res.status(401).json({ message: "Wrong Password" });
     }
   }

  //res.send("Hello World from route 2!");
})

app.get('/questions', function(req, res) {
  //return all the questions
  res.send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem

  const questionid = req.body.questionid;
  const user_email = req.body.user_email;
  const filteredSubmissions = SUBMISSION.filter((submission) => {
    return (
      submission.questionid === questionid && submission.user_email === user_email
    );
  });
  res.send(filteredSubmissions)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const questionid = req.body.questionid;
   const user_email = req.body.user_email;
   const code = req.body.code;
   const randomNum = Math.random();
   const status = randomNum < 0.5 ? "Accept" : "Reject";
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push({questionid,user_email,code,status})
   res.status(200).json({message:status})
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
 
app.post("/add-problem", function(req,res){

  const email = req.body.email

  const user = USERS.find((user) => user.email === email);
  const isAdmin = user.admin;
  if (!isAdmin) {
     res.status(400).json({ message: "Privileges to add Dont exist!!" });
  } 
  else{
    const questionid = req.body.questionid
    const title = req.body.title;
    const description = req.body.description;
    const testCases = req.body.testCases

    if(!questionid || !title || !testCases || !description){
      res.status(400).json({ message: "Enter all the values." });
    }
    else{
      QUESTIONS.push({questionid,title,description,testCases})
      res.status(200).json({message:"The question has been added."})
    }

  }
})

app.post("/edit-problem", function (req, res) {
  const email = req.body.email;

  const user = USERS.find((user) => user.email === email);
  const isAdmin = user.admin;
  if (!isAdmin) {
    res.status(400).json({ message: "Privileges to add Dont exist!!" });
  } else {
    const questionid = req.body.questionid;
    const title = req.body.title;
    const description = req.body.description;
    const testCases = req.body.testCases;

    const updatedQuestions = QUESTIONS.map((question) => {
      if (question.questionid === questionid) {
        // If the question id matches the id we want to update, create a new object with the updated title
        return {
          questionid: questionid,
          title: title,
          description: description,
          testCases: testCases,
        };
      } else {
        // If the question id doesn't match, return the original object
        return question;
      }
    });
    QUESTIONS = updatedQuestions;
    res.status(200).json({ message: "Succefully edited" });
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})