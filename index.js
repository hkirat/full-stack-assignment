const express = require('express')
const app = express()
const port = 3001
const jwt = require('jsonwebtoken');
const USERS = [];
const secretString = 'RHYTHMGARG20021105';

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
    title: "Length of array",
    description: "Given an array , return the length of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}
];

const SUBMISSION = [{
    problemId: "1",
    solution: "some solution",
    submissionAccepted: true
}, {
    problemId: "2",
    solution: "some solution",
    submissionAccepted: true
}
];

app.post('/signup', function(req, res) {
    const {email, password} = req.body;
    const existingUser = USERS.find(user => user.email === email);
    if(existingUser) {
        return res.status(400).json({error: 'User already exists'});
    }
    USERS.push({email, password});
    res.status(200).json({message : 'SignUp successful'});
});

app.post('/login', function(req, res) {
    const {email, password} = req.body;
    const user = USERS.find(user => user.email === email);
    if(!user || user.password !==password) {
        return res.status(401).json({error : 'Invalid email or password'});
    }

    const token = jwt.sign({email:user.email}, secretString);
    res.status(200).json({token});
})

app.get('/questions', function(req, res) {
    res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
    res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
    const submissionAccepted = Math.random() < 0.5;
    const submission = {
        problemId: req.body.problemId,
        solution: req.body.solution,
        submissionAccepted : submissionAccepted
    };
    SUBMISSIONS.push(submission);
    res.status(200).json({submissionAccepted});
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})