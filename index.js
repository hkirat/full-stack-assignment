const crypto = require('crypto');
const express = require('express')
const {json} = require("body-parser");
const app = express()
const port = 3000
app.use(json());
const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []

app.post('/signup', function (req, res) {
    // Add logic to decode body.
    // body should have email and password
    let userInfo = req.body;
    const userExists = USERS.some(u => u.email === userInfo.email);
    if (userExists === true) {
        return res.status(400).send("User already exists");
    }
    if (userInfo.email === "" || userInfo.password === "") {
        res.status(400).send("Invalid email or password");
    }
    let user = {
        email: userInfo.email,
        password: userInfo.password,
        isAdmin: userInfo.isAdmin,
        token: null
    }
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push(userInfo);
    // return back 200 status code to the client
    return res.status(200).send("User created successfully");
})

app.post('/login', function (req, res) {
    // Add logic to decode body.
    // body should have email and password
    let userInfo = req.body;
    if (userInfo.email === "" || userInfo.password === "") {
        res.status(400).send("Invalid email or password");
    }
    const user = USERS.find(u => u.email === userInfo.email);

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    if (user == null) {
        return res.status(400).send("User does not exist");
    }
    // If the password is not the same, return back 401 status code to the client
    if (user.password !== userInfo.password) {
        return res.status(401).send("Invalid password");
    }
    const index = USERS.findIndex((user) => user.email === userInfo.email);
    USERS.splice(index, 1);
    user.token = crypto.randomBytes(14).toString("base64");
    USERS.push(user);
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    return res.status(200).send({"token": user.token});
})

app.get('/questions', function (req, res) {
    //return the user all the questions in the QUESTIONS array
    res.send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    let userEmail = req.query.email;
    let question = req.query.question;
    let userSubmissions = SUBMISSION.filter(s => s.email === userEmail && s.question === question);
    res.status(200).send( userSubmissions);
});


app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    SUBMISSION.push({
        question: req.body.question,
        email: req.body.email,
        code: req.body.code,
        status: Math.random() > 0.5 ? "Accepted" : "Rejected"
    });
     return res.status(200).send("Submission created successfully");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/admin/questions/add", function (req, res) {
    let userInfo = req.body.email;
    let token = req.body.token;
    if (token === "") {
        return res.status(401).send("Invalid token");
    }
    const user = USERS.find(u => u.email === userInfo);
    if (user == null) {
        return res.status(400).send("User does not exist");
    }
    if (user.isAdmin === false) {
        return res.status(401).send("Not an admin");
    }
    if (user.token !== token) {
        return res.status(401).send("Invalid token");
    }
    QUESTIONS.push({
        title: req.body.title,
        description: req.body.description,
        testCases: req.body.testCases
    });
    return res.status(200).send("Question created successfully");
});


app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
});