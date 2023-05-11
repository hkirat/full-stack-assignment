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
}];


const SUBMISSIONS = [

]

app.post('/signup', function(req, res) {
    const { email, password, role } = req.body;
    const existingUser = USERS.find(u => u.email === email);

    if (existingUser) {
        return res.status(400).send('User with this email already exists');
    }

    if (!['admin', 'user'].includes(role)) {
        return res.status(400).send('Invalid role');
    }

    USERS.push({ email, password, role });
    res.status(200).send('User created successfully');
});

app.post('/login', function(req, res) {
    const { email, password } = req.body;
    const existingUser = USERS.find(u => u.email === email && u.password === password);

    if (!existingUser) {
        return res.status(401).send('Invalid email or password');
    }

    // Just sending a static token for now.
    res.status(200).send({ token: 'abc123' });
});

app.get('/questions', function(req, res) {
  res.status(200).send(QUESTIONS)
})

app.post('/questions', function(req, res) {
    const { token, question } = req.body;
    const existingUser = USERS.find(u => u.token === token);

    if (!existingUser) {
        return res.status(401).send('Invalid token');
    }

    if (existingUser.role !== 'admin') {
        return res.status(403).send('Only admins can add questions');
    }

    QUESTIONS.push(question);
    res.status(200).send('Question added successfully');
});

app.get("/submissions", function(req, res) {
  res.status(200).send(SUBMISSIONS)
})

app.post("/submissions", function(req, res) {
  const submission = req.body
  submission.status = Math.random() > 0.5 ? 'Accepted' : 'Rejected'
  SUBMISSIONS.push(submission)
  res.status(200).send(submission)
})

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
// give the user an option to become an admin or a normal user on sign up


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})