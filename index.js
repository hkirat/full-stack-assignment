const express = require('express')
const app = express()
const port = 3000

const USERS = [];

const QUESTIONS = [{
    title: "Two States",
    description: "Given an array, return the maximum of the array.",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [
    // should have title, solution
];

app.post('/signup', (req, res) => {
    
    // add logic to decode body
    const { email, password } = req.body;

    // check if the email already exists
    const userExists = USERS.some(user => user.email === email);
    if (userExists) {
        return res.status(409).send('User with this email already exists');
    }

    // add user to the USERS array
    USERS.push({ email, password });

    // return back 200 status code to the client
    res.status(200).send('User successfully signed up!');
});

app.post('/login', (req, res) => {
    
    // add logic to decode body
    // body should have email and password
    const { email, password } = req.body;

    // check if the user with the given email exists in the USERS array
    // also ensure that the password is the same
    const user = USERS.find(user => user.email === email && user.password === password);

    // if the password is the same, return back 200 status code to the client
    // also, send back a token (any random string will do for now)
    // if the password is not the same, return back 401 status code to the client
    if (user) {
        const token = 'random-token';
        res.status(200).send({ token });
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/questions', (req, res) => {
    res.json(QUESTIONS);
});

app.get('/submissions', (req, res) => {

    // retrieve the title of the question from the query string
    const title = req.query.title;

    // filter the SUBMISSION array to include only submissions for the requested problem title
    const submissionForProblem = SUBMISSION.filter(submission => submission.title === title);

    // return the filtered submissions array to the client
    res.json(submissionForProblem)
});

app.post('/submissions', (req, res) => {

    // add logic to decode body
    // body should have title and solution

    const { title, solution } = req.body;

    // randomly accept or reject the solution
    const isAccepted = Math.random() > 0.5;

    // store the submission in the SUBMISSION array
    SUBMISSION.push({ title, solution });

    // send back the result to the client
    res.send({ isAccepted });
});

// route to add a new problem to the QUESTIONS array (only accessible by admins)
app.post('/admin/addQuestion', function(req, res) {
    
    // check if the user is an admin, reject the request if not
    if (!req.query.isAdmin) {
        return res.status(401).send('Unauthorized Access');
    }

    // add the new questions to the QUESTION array
    const newQuestion = req.body;
    QUESTION.push(newQuestion);

    res.status(200).send('Question added successfully.');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});