const express = require('express')
const app = express()
const port = 3001


const generateId = () => Math.random().toString(36).substring(2, 10); // generate unique id for every new users created
const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}
];


const SUBMISSION = [

]

app.get("/", (req, res) => {
  res.send("Hello world!!")
})

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const result = USERS.filter(user => user.email === email);
  if (!result.length) {
    USERS.push({
      id: generateId(),
      password,
      email
    })
    return res.status(200).send("Account Created Successfully!!")
  }

  return res.status(401).send({ error_message: "User Already Exists!!" })
  // return back 200 status code to the client
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const result = USERS.filter(user => user.email === email && user.password === password);

  if (result.length === 1) {
    return res.statusCode(200).send({ token: `${result[0].id}` })
  }
  if (result.length !== 1) {
    return res.statusCode(401).send("Credentials do not match!!")
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  // res.send('Hello World from route 2!')
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  // res.send("Hello World from route 3!")

  let result = '<div>'

  QUESTIONS.forEach(item => {
    result += `<div><h2>${item.title}</h2><h3>${item.description}</h3></div>`
    let testCasesHtml = '<div>';
    item.testCases.forEach(item => {
      testCasesHtml += `<p>Input: ${item.input}</p><p>Output: ${item.output}</p>`
    })
    testCasesHtml += '</div>'

    result += testCasesHtml;
  })

  result += '</div>'

  res.send(result)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  // res.send("Hello World from route 4!")
  res.send(SUBMISSION)
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const userSubmission = req.body;
  const result = Math.random() < 0.5;

  SUBMISSION.push({ ...userSubmission, result })

  if (result) {
    res.status(200).send("Your submission was accepted!");
  } else {
    res.status(401).send("Your submission was rejected.");
  }


  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})