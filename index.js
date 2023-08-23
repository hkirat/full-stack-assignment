const express = require('express')
const bodyParser = require('body-parser');
const {response} = require("express");
const app = express()
const port = 3001

app.use(bodyParser.json());

const USERS = [
    {
        email: "anshikjainxx@gmail.com",
        password: "anshikxxxx",
        isAdmin: true
    }
];

const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array, return the maximum of the array.",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "5"
        }]
    }
];


const SUBMISSIONS = []

app.get('/', function(req, res) {

    //login/signup screen

    const htmlResponse = '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '  <meta charset="UTF-8">\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        '  <title>Login</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '  <div>\n' +
        '    <h2>Login</h2>\n' +
        '    <form>\n' +
        '      <input type="text" placeholder="Email" required>\n' +
        '      <input type="email" placeholder="Password" required>\n' +
        '      <button type="submit">Login</button>\n' +
        '    </form>\n' +
        '  </div>\n' +
        '</body>\n' +
        '</html>\n'

    res.send(htmlResponse)
})

app.post('/signup', function(req, res) {
    // Add logic to decode body
    // body should have email and password
    const body = {
        email: req.body.email,
        password: req.body.password,
        isAdmin: false
    }

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

    if(USERS.find(function (user) {
        if (user['email'] === body['email']) {
            return true
        }
    })) {
        res.send("Email already registered.")
    }
    else {
        USERS.push(body)
        res.status(200).send("Sign up successful.")
    }
    // return back 200 status code to the client
})

app.post('/login', function(req, res) {
    // Add logic to decode body
    // body should have email and password

    const body = {
        email: req.body.email,
        password: req.body.password
    }

    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same


    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client

    if (USERS.find(function (user) {
        if (user['email'] === body['email'] && user['password'] === body['password']) {
            return true
        }
    })) {
        const response = {
            message: "Login successful.",
            token: ("" + Math.random()).substring(2, 8)
        }
        res.status(200).json(response)
    }
    else {
        res.status(401).send('Login failed. Check email or password.')
    }
})

app.get('/questions', function(req, res) {

    //return the user all the questions in the QUESTIONS array
    res.status(200).send(QUESTIONS)
})

app.get("/submissions", function(req, res) {
    // return the users submissions for this problem
    res.status(200).send(SUBMISSIONS)
})

app.post("/submissions", function(req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above

    const body = {
        solution: req.body.solution,
        isCorrect: Math.random() < 0.5
    }

    SUBMISSIONS.push(body)

    if (body['isCorrect']) {
        res.status(200).send("Correct answer")
    }
    else{
        res.status(200).send("Incorrect answer")
    }
});

app.post("/addQuestion", function (req, res) {

    // leaving as hard todos
    // Create a route that lets an admin add a new problem
    // ensure that only admins can do that.
    const body = {
        email: req.body.email,
        password: req.body.password,
        question: req.body.question
    }

    if (USERS.find(function (user) {
        if (user['email'] === body['email'] && user['password'] === body['password'] && user['isAdmin']) {
            return true
        }
    })) {
        QUESTIONS.push(body['question'])
        res.status(200).send("Question added successfully.")
    }
    else {
        res.status(200).send("Only admins can add questions.")
    }
})

app.listen(port, function() {
    console.log(`Example app listening on port ${port}`)
})