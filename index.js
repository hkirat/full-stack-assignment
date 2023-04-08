const express = require('express')
const path = require('path');


const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}, {
  title: "Array sum",
  description: "Given an array , return the sum of all the elements.",
  testCases: [{
    input: "[1,2,3,]",
    output: "6"
  }, {
    input: "[10,5]",
    output: "15"
  }]
}, {
  title: "Search in Rotated Sorted Arrays",
  description: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
  testCases: [{
    input: nums = '[4,5,6,7,0,1,2], target = 0',
    output: '4'
  }]
}];
const SUBMISSIONS = [
  { solution: 'one' }, { solution: 'two' }, { solution: 'three' },
]


app.use(express.json()); // middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files from the public folder

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', function (req, res) {
  // extract email and password from request body
  let { email, password } = req.body;

  // check if the email already exists in the USERS array
  let userExists = USERS.some(user => user.email === email);

  if (!userExists) {
    // add user to USERS array
    USERS.push({ email, password });
    console.log({ email, password });
    res.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));
  } else {
    res.status(409).json({ message: 'user already exist' });
  }
});

app.get('/login', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})



app.post('/login', function (req, res) {

  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  let { email, password } = req.body;


  let validUser = USERS.some(user => (user.email === email && user.password === password));

  if (validUser) {
    console.log({ email, password }, "has logged in");
    res.status(200).json({ message: 'Login successful', token: "axhttrts556gba77bva77yfvx44555ggttgg" });
  } else {
    console.log('user does not exist');
    res.status(401).json({ message: 'wrong credentials', });
  }


})



app.get('/questions', (req, res) => {
  const html = `<html><body> <div> ${QUESTIONS.map(question => {
    return (
      `<h3>${question.title}</h3><p>${question.description}</p><p>TEST CASES:</p><div>
            ${question.testCases.map(test => {
        return (
          `<b>Input: ${test.input}</b><p>output: ${test.output} </p>`
        )
      })}
            </div>`)
  })} </div></body> </html>`

  res.status(200).send(html);
})



app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const solutions = ` ${SUBMISSIONS.map(sol => {
    return (
      `<p> solution: ${sol.solution} </p>`
    )
  })}`
  res.status(200).send(solutions);
})

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  let check = Math.random * 10 < 5
  let response;
  if (check) { response = 'Accepted'; SUBMISSIONS.push(req.body); }
  else response = 'Rejected'
  res.send(response);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', function (req, res) {
  // Check if the user is an admin
  const isAdmin = req.body.email === 'admin@example.com';

  if (!isAdmin) {
    // Return a 401 unauthorized response if the user is not an admin
    return res.status(401).send({ error: 'Only admins are allowed to add new problems' });
  }

  // If the user is an admin, add the new problem to the QUESTIONS array
  const newProblem = {
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases
  };
  QUESTIONS.push(newProblem);

  // Return a success response
  res.status(200).send({ message: 'Problem added successfully' });
});





app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})