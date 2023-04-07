const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
const USERS = [
  {
    email: "username",
    password: "test123",
  },
];

const ADMIN = [
  {
    username: "Rishav1234",
    password: "Test1234"
  }
];

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
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //--it will take enter from the html form--
  const email = req.body.email;
  const password = req.body.password;
  const userDetails = { email, password };
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.forEach((user) => {
    if (user.email !== email) {
      USERS.push(userDetails);
      return res.status(200).send({ message: "Signup successfully" });
    } else {
      return res.status(401).send({ message: "User Exist" });
    }
  });

  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // --take the input from the html form
  const email = req.body.email;
  const password = req.body.password;

  USERS.forEach((user) => {
    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    if (user.email === email && user.password === password) {
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const token = "hkfsarr2134";
      return res.status(200).send({ message: "Login Succesfully", token: token });
    } else {
      // If the password is not the same, return back 401 status code to the client
      return res.status(401).send({ message: "wrong credentials" });
    }
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  //using foreach
  QUESTIONS.forEach((ques) => {
    res.write(`<h1>${ques.title}</h1>`);
    res.write(`<h2>${ques.description}</h2>`);

    ques.testCases.forEach((testcase) => {
      res.write(`<p style="font-size: 1.5rem">${testcase.input}</p>`);
      res.write(`<p style="font-size: 1.5rem">${testcase.output}</p>`);
    });
    res.send();
  });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  SUBMISSION.forEach((submited) => {
    res.write(`<p>${submited.questions}</p>`);
    res.write(`<p>${submited.username}</p>`);
  });
  res.send();
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const submit = new Boolean(false);

  const { questions, username } = req.body;

  //--we can check the submit output and the question output--
  if (submit) {
    // Store the submission in the SUBMISSION array above
    SUBMISSION.push({ questions, username });
    return res.status(200).send({ message: "Submmited" });
  } else {
    return res.status(400).send({ message: "Wrong Submission" });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
app.get("/composeproblem", function(req, res){
  const adminUser= req.body;
  const adminPassword = req.body;
  ADMIN.forEach((admin)=>{
    if(admin.username===adminUser&&admin.password===adminPassword)
    {
      res.status(200).send({message:"Authorized to compose the problem"});
    }
    else{
      res.status(401).send({message:"wrong credentials"});
    }
  })
})
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
