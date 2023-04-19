const express = require("express");
const app = express();
const port = 3001;

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
      {
        input: "[12,34,456,1000]",
        output: "1000",
      },
    ],
  },
  {
    title: "reduce to array sum",
    description: "Given an array , return the sum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "15",
      },
      {
        input: "[12,34,456,1000]",
        output: "12",
      },
    ],
  },
  {
    title: "find min",
    description: "Given an array , return the min of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "1",
      },
      {
        input: "[10,40,20,30]",
        output: "100",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    // If user already exists, return 400 status code to the client
    return res.status(400).send("User already exists");
  }

  // If user with the given email doesn't exist, create a new user object and add it to the USERS array
  const newUser = { email, password };
  USERS.push(newUser);

  // return back 200 status code to the client
  return res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    // If user does not exist, return 401 status code to the client
    return res.status(401).send("User not found");
  }

  // Check if the password is correct
  if (user.password !== password) {
    // If password is incorrect, return 401 status code to the client
    return res.status(401).send("Incorrect password");
  }

  // If email and password are correct, create a token (any random string will do for now)
  const token = "some-random-string";

  // return back 200 status code to the client with the token in the response body
  return res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  //   res.send("Hello World from route 3!")
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { email } = req.query;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  const userSub = SUBMISSION.filter((submission) => submission.email === email);
  res.status(200).send(userSub);
  //   res.send("Hello World from route 4!")
});

app.post("/submissions", function(req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const { email, questionTitle, code } = req.body;
 
    if(!email || !questionTitle || !code){
         return res.status(400).send('Invalid');
    }
 
    const question = QUESTIONS.find(question => question.title === questionTitle);
    if(!question){
         return res.status(!404).send('Question not found');
    }
 
    const isCorrect = Math.round(Math.random()) == 1;
    const submission = { email, questionTitle, code, isCorrect };
    SUBMISSION.push(submission);
 
    res.status(200).send({ isCorrect });
 //   res.send("Hello World from route 4!")
 });

app.post("/addque", function(req, res){
    const { title, description, testCases } = req.body;

    const isAdmin = req.headers.authorization == 'ADMIN'; // checking if the user is an admin by using checking the tokens. Some random token here for now

    if(!isAdmin){
        return res.status(401).send("Unauthorized access!");
    }

    const newQuestion = { title, description, testCases };
    QUESTIONS.push(newQuestion);

    res.status(200).send('Question Added');

})


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
