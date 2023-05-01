const express = require('express')
const app = express()
const port = 3000

const USERS = [
  {
    name: 'John',
    password: 'john1234',
    role: 'Admin'
  }
];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  title: "Sort Array",
  description: "Return the Sorted Array",
  testCases: [{
    input: [2, 9, 4, 5],
    output: [2, 4, 5, 9]
  }]
}
];


const SUBMISSION = [

]

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required for SignUp');
  }

  const isUserExist = USERS.find((user) => user.email === email);
  if (isUserExist) {
    return res.status(400).send('User already exists');
  }

  // return back 200 status code to the client
  USERS.push({ email, password });
  res.status(200).send('Your account has beensuccessfully created!');
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  if (user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = "KNPKQ395004";
  res.status(200).send('logged in successfully!', token);

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS)
})

app.get("/submissions", function (req, res) {

  const { userId, quesId, code, language } = req.query;
  const submission = SUBMISSION.find((s) => s.userId === userId && s.quesId === quesId && s.code === code && s.language === language);

  if (submission) {
    res.status(200).send(submission);
  } else {
    res.status(404).send('Submission not found.');
  }
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { userId, quesId, code, language } = req.body;
  SUBMISSION.push({
    id: SUBMISSION.length + 1, userId, quesId, code, language,
  });

  res.status(200).send('Submission Done!');
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addAnotherProblem", function (req, res) {

  if (req.user.role === 'admin') {
    const { title, description, testCases } = req.body;
  
    if (!title || !description || !testCases) {
      return res.status(400).send('All fields are required!');
    }
    const newProblem = {
      title, description, testCases,
    };
    res.status(200).send('New problem added successfully!');
  }
  
  else {
    res.status(401).send('Unauthorized'); 
  }
})
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})