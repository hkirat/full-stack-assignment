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


const SUBMISSION = [] // Adds all the accepted submissions to the array

app.post('/signup', function(req, res) {
    const { email, password } = req.body;

    const userExists = USERS.find(user => user.email === email);

    if (userExists) {
        return res.status(409).send('User already exists');
    }
    USERS.push({ email, password });

    res.status(200).send('User created successfully');
})

app.post('/login', function(req, res) {
    const { email, password } = req.body;

    const user = USERS.find(user => user.email == email);

    if (user && user.password == password) {
        const token = "correct data";
        res.status(200).json({ token });
    } else {
        const token = "incorrect data";
        res.status(401).send({ token });
    }
})

app.get('/questions', function(req, res) {
    //return the user all the questions in the QUESTIONS array
    res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
    // return the users submissions for this problem
    res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
    const isAccepted = Math.random() >= 0.5;
    const submission = {
        question: req.body.question,
        answer: req.body.answer,
        isAccepted
    };
    SUBMISSION.push(submission);
    res.send(submission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
    console.log(`Example app listening on port ${port}`)
})