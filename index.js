const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
},
{
  title: "Reverse a string",
  description: "Given a string, return the string in reverse order.",
  testCases: [
    {
      input: "hello world",
      output: "dlrow olleh"
    }
  ]
}];

const SUBMISSION = [

]

app.post('/signup', function (req, res) {
  const { email, password } = req.body;
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(409).send('User already exists');
  }
  USERS.push({ email, password });
  res.sendStatus(200);
  res.send('Hello World!')
})

app.post('/login', function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  if (user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  const token = 'random_token_string';
  res.status(200).send({ token });
  res.send('Hello World from route 2!')
})

app.get('/questions', function (req, res) {

  res.send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
  const problemId = req.query.problemId;

  const submissions = SUBMISSIONS.filter((submission) => {
    return submission.problemId === problemId;
  });

  res.send(submissions);
});


app.post("/submissions", function (req, res) {
  const { user, problemId, solution } = req.body;
  const isAccepted = Math.random() < 0.5;

  const submission = { user, problemId, solution, isAccepted };
  SUBMISSION.push(submission);

  if (isAccepted) {
    res.status(200).send({ message: "Solution accepted!" });
  } else {
    res.status(400).send({ message: "Solution rejected!" });
  }
});

// leaving as hard todos
app.post('/problems', function (req, res) {
  const { title, description, testCases } = req.body;

  if (req.user.isAdmin) {
    const problem = {
      title: title,
      description: description,
      testCases: testCases
    };

    QUESTIONS.push(problem);

    res.send('New problem added successfully');
  } else {
    res.status(401).send('Only admin users are allowed to add new problems');
  }
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})

