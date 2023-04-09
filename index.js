const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const port = 3000;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    title:"Graph",
    description:"Check wether the graph is connected or not",
    testCases:[
      {
        input : "[1,2,3,4,5]",
        output:"False",
      },
    ],
  }
];

const SUBMISSION = [];

app.get("/" ,(req,res)=>{
  res.send(`Work Under Progress!!`)
})

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  users.push({ email, password });

  res.status(200).send(`User Signed up scessfully !!!`);
});

app.post("/login", (req, res)=>{
  const { email, password } = req.body;

  const user = users.find(
    (user) => users.email === email && users.password === password
  );

  if (user) {
    const token = jwt.sign({ email }, JWT_SECRET);
    res.status(200).send({ token });
  } else {
    res.status(401).send("Invalid Email or password !!!");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS)
});


app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSION)
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const {solution} = req.body
  const accepted= Math.random() < 0.5
  SUBMISSION.push({solution ,  accepted})

  if(accepted){
    res.status(200).send(`Solution Accepted `)
  }
  else{
    res.status(200).send(`Soltion Rejected`)
  }
});


const isAdmin = (req, res, next) => {
  // Check if user is an admin
  const user = req.user;
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).send('Unauthorized access');
  }
};



app.post('/newproblems', isAdmin, (req, res) => {
  const { text } = req.body;
  
  const newProblem = { id: problems.length + 1, text };
  problems.push(newProblem);
  res.status(200).send('Problem added successfully');
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
