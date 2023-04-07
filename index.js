const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}, {
    title: "Single Number",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    testCases: [{
        input: "[2,2,1]",
        output: "1"
    }]
}];


app.post('/signup', function (req, res) {
    // Decode the request body to get email and password
    const { email, password } = req.body;

    // Check if a user with the given email already exists
    const existingUser = USERS.find(user => user.email === email);

    if (existingUser) {
        // Return a 409 Conflict response if user already exists
        return res.status(409).send('User with this email already exists');
    }

    // Add the new user to the USERS array
    USERS.push({ email, password });

    // Return a 200 OK response
    res.status(200).send('User created successfully');
})


app.post('/login', function (req, res) {
    // Decode the request body to get email and password
    const { email, password } = req.body;

    // Find the user with the given email in the USERS array
    const user = USERS.find(user => user.email === email);

    if (!user) {
        // Return a 401 Unauthorized response if user doesn't exist
        return res.status(401).send('Invalid email or password');
    }

    // Check if the password is correct
    if (user.password !== password) {
        // Return a 401 Unauthorized response if password is incorrect
        return res.status(401).send('Invalid email or password');
    }

    // Return a 200 OK response with a token
    const token = 'some-random-string';
    res.status(200).json({ token });
})
// GET request to '/questions'
fetch('/questions')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

const SUBMISSIONS = [{
    questionIndex: 0,
    user: "John",
    code: "function max(arr) { ... }",
    result: "5"
}, {
    questionIndex: 1,
    user: "Jane",
    code: "function singleNumber(nums) { ... }",
    result: "1"
}, {
    questionIndex: 1,
    user: "Bob",
    code: "function singleNumber(nums) { ... }",
    result: "2"
}];

app.get("/submissions/:questionIndex", function (req, res) {
    const questionIndex = parseInt(req.params.questionIndex);
    const question = QUESTIONS[questionIndex];
    const submissions = SUBMISSIONS.filter(submission => submission.questionIndex === questionIndex);
    res.status(200).json({ question, submissions });
});
app.post("/submissions", function (req, res) {
    const submission = req.body;

    // Get the corresponding question for the submission
    const question = QUESTIONS.find(q => q.title === submission.questionTitle);

    // Randomly accept or reject the solution
    const isAccepted = Math.random() < 0.5;

    // Add the submission to the array
    SUBMISSIONS.push({
        ...submission,
        isAccepted
    });

    // Send a response back to the client
    if (isAccepted) {
        res.status(200).json({
            message: "Solution accepted"
        });
    } else {
        res.status(400).json({
            message: "Solution rejected"
        });
    }
});

app.get("/submissions", function (req, res) {
    // Return all the submissions in the SUBMISSIONS array
    res.status(200).json(SUBMISSIONS);
});
app.post("/problems", function (req, res) {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
        return res.status(401).send("Only admins can add problems");
    }

    // Get the title, description, and test cases from the request body
    const { title, description, testCases } = req.body;

    // Create a new problem object and add it to the QUESTIONS array
    const newProblem = { title, description, testCases };
    QUESTIONS.push(newProblem);

    // Send a success response back to the client
    res.status(200).send("Problem added successfully");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
