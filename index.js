const express = require('express')
const app = express()
const port = 3001

const USERS = [];
const ADMIN = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = []

app.use(express.json());

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // return back 200 status code to the client

  const { email, password, accType } = req.body;

  let user;

  if (accType === "user")
    user = USERS.find(user => user.email === email);
  else
    user = ADMIN.find(user => user.email === email);


  if (!user) {
    accType === "user" ? USERS.push({ email, password }) : ADMIN.push({ email, password });
    return res.status(200).send(`${accType} account is created for ${email}`);
  }

  return res.status(400).send("account already exists!");



})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  const user = USERS.find(user => user.email === req.body.email && user.password === req.body.password);

  user ? res.cookie("autorizationId", "this is your key").status(200).send() : res.status(401).send();

})

app.get('/questions', function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { title, email } = req.query;

  const submissions = SUBMISSION.filter((record) => { return record.title === title && email === email });

  res.send(submissions);
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const status = Math.floor(Math.random() * 2);

  const { email, title, code } = req.body;

  SUBMISSION.push({ email, title, code, status })

  status ? res.send("solution accepted") : res.send("solutioin not accepted");

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/addquestion', (req, res) => {
  const { email, question, question: { title } } = req.body;

  const admin = ADMIN.find(user => user.email === email)

  if (!admin)
    return res.status(400).send("your not an admin");

  QUESTIONS.find(problem => problem.title === title) ? res.status(401).send("question Id is already choosen") : QUESTIONS.push(question);

  return res.status(200).send("question added successfully");

})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})