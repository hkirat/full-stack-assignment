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

app.get('/', (req, res) => {

})

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  let email = req.body.email;
  let password = req.body.password;
  let accType = req.body.position;
  let user;
  if (accType === "user") {
    if (USERS.length != 0)
      user = USERS.filter((user) => { return user.email === email });

  } else {

    if (ADMIN.length != 0)
      user = ADMIN.filter((user) => { return user.email === email });
  }
  if (!user) {
    console.log('user is added');
    accType === "user" ? USERS.push({ email, password }) : ADMIN.push({ email, password });

  }

  if (!user)
    return res.status(200).send(`${accType} account is created for ${email}`);

  console.log(user);
  return res.status(400).send("account already exists!");


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  let user;

  if (USERS.length != 0)
    user = USERS.filter((user) => { return user.email === req.body.email && user.password === req.body.password });

  if (user)
    res.status(200).cookie("autorizationId", "this is your key").send();

  else res.status(401).send();


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const questionId = req.query.questionId;
  const email = req.query.email;

  const submissions = SUBMISSION.filter((record) => { return record.questionId === questionId && email === email });

  res.send(submissions);
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  let decision = Math.floor(Math.random() * 2);
  const email = req.body.email;
  const title = req.body.title;
  const code = req.body.code;

  SUBMISSION.push({ email, title, code, status: decision })

  if (decision)
    res.send("solution accepted");
  else
    res.send("solutioin not accepted");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/addquestion', (req, res) => {

  let email = req.body.email;
  let question = req.body.question;
  let questionId = req.body.question.title;
  let admin;
  if (ADMIN.length != 0)
    admin = ADMIN.filter((user) => { return user.email === email });

  if (!admin)
    return res.status(400).send("your not an admin");

  let checkId;

  if (QUESTIONS.length != 0)
    checkId = QUESTIONS.filter((problem) => { return problem.title === questionId })

  console.log(checkId);
  if (checkId.length === 0)
    QUESTIONS.push(question);
  else
    return res.status(401).send("question Id is already choosen");

  return res.status(200).send("question added successfully");


})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})