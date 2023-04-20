const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const port = 3001;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const USERS = [];

const QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client


  const { email, password ,isAdmin} = req.body;
  const newUser = {
    id: String(USERS.length + 1),
    email,
    password,
    isAdmin: isAdmin || false,// Set the isAdmin flag based on the request body
  };

  const emailExists = USERS.find((user) => user.email == email);
  if (emailExists) {
    return res.status(409).json({ message: "Email already exists" });
  } else {
    USERS.push(newUser);
    return res.status(200).json(newUser);
  }
 
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  


  const { email, password } = req.body;
  const user = USERS.find((user) => user.email == email);
  if (user) {
    if (user.password == password) {
      const token = Math.random().toString(36).substring(2, 10)
      return res.status(200).json({ message: "Login successful" ,token});
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } else return res.status(400).json({ message: "user not exist.." });


});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that
app.post("/questions",function (req,res){
  const { title, description, testcases ,userid} = req.body
  const user = USERS.find((user)=>user.id==userid); 
  if (user.isAdmin) { 
    
    const newQuestion = {
      id:String(QUESTIONS.length+1),
      title,
      description,
      testcases,
      };
    QUESTIONS.push(newQuestion);
    res.status(200).json(newQuestion)
  }
  else{
    res.status(401).json({ message: "Not authorized" });
  }
})

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array

  return res.status(200).json(QUESTIONS)
});

app.get("/submissions/:id", function (req, res) {
  // return the users submissions for this problem
  const id = req.params.id
  const submissions = SUBMISSION.filter(submission=>submission.question_id==id)
  return res.status(200).json(submissions)
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above


  const {question_id,title,solution}=req.body
  const result = Math.random() < 0.5 ? "Accepted" : "Rejected"
  const new_submission = {
    id:SUBMISSION.length+1,
    question_id:question_id,
    title:title,
    solution:solution,
    status:result
  }

  SUBMISSION.push(new_submission)
  return res.status(200).send(new_submission)


});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
