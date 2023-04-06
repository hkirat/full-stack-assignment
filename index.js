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

function userExists(email) {
    return USERS.some(user => user.email === email);
}

const SUBMISSION = [

]

app.post('/signup', function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const {email, password} = req.body

    if (userExists(email)) {
        res.status(400).send("User with that email already exists")
    }

    USERS.push({email, password});

    // Return success message
    res.status(200).send('User registered successfully!');

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)


    // return back 200 status code to the client
})

app.post('/login', function (req, res) {
    // Add logic to decode body
    // body should have email and password

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    const {email, password} = req.body;

    const user = USERS.find(user => user.email === email)

    if (!user || user.password !== password) {
        return res.status(401).send("Invalid email or password")
    }

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client

    const token = Math.random().toString(36).substring(2, 15);
    res.status(200).json({token});
})

app.get('/questions', function (req, res) {

    //return the user all the questions in the QUESTIONS array
    res.status(200).json(QUESTIONS)
})

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    const userId = req.headers['user-id'];
    const userSubmissions = SUBMISSION.filter(submission => submission.userId === userId);
    res.status(200).json(userSubmissions);
});


app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const {questionId, solution} = req.body;
    const userId = req.headers['user-id'];
    const isAccepted = Math.random() >= 0.5;

    SUBMISSION.push({userId, questionId, solution, isAccepted});

    // Return success message
    res.status(200).send('Submission received');
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})