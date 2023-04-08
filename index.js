const express = require('express')
const app = express()
const port = 3001
app.use(express.json());
const USERS = [
  {
    id: 1,
    email: "sample1@gmail.com",
    password: "123456789"
  },
  {
    id: 2,
    email: "sample2@gmail.com",
    password: "987654321"
  }
];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [

]
/**********utils-functions******************/

const findUserSubmission = (email, quesId) => {
  return SUBMISSION.filter(
    (submission) =>
      submission.email === email &&
      submission.problemId === problemId
  )
}

/**********utils-functions******************/
app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // check whether the entered email is exists or not
  const user = USERS.filter((user) => {
    return user.email === email
  })

  if (user.length !== 0) {
    res.status(409).json('user with this email is already exists')
  } else {
    // create the new user
    const newUser = { id: 3, email, password };
    // push the user in the user array
    USERS.push(newUser);
    res.status(200).send(USERS)
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.filter((user) => {
    return user.email === email
  })

  if (user.length !== 0) {
    if (user[0].password === password) {
      const authToken = 'thisisthesampletoken';
      res.status(200).send(authToken);
    } else {
      res.status(401).send('invalid crediential')
    }
  } else {
    res.status(401).send('unauthorized person')
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array

  res.status(200).json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const { email, questionId } = req.body;

  const userSubmitData = findUserSubmission(email, questionId)
  if (userSubmitData.length !== 0) {
    res.status(200).json(userSubmitData)
  } else {
    res.status(404).send('submissions is not found')
  }
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution

  const { email, questionId, title, description, input, output } = req.body;

  const questionOutput = QUESTIONS.filter(question => {
    return question.testCases[0].output === output
  })
  if (questionOutput.length !== 0) {
    const newSubmisions = { email, questionId, title, description, input, output };
    SUBMISSION.push(newSubmisions);
    res.status(200).send(newSubmisions);
  }
  else {
    res.status(400).send('time limt exeed')
  }
  // Store the submission in the SUBMISSION array above

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})