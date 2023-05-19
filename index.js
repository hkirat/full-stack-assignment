const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 6969
const fs = require('fs')
const path = require('path')
let jsonQues = fs.readFileSync('data.json', 'utf-8')
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const USERS = [{
    email: "bilal101shaikh@gmail.com",
    password: "1234",
    isAdmin: true
},
{
    email: "harkirat@web3.sol",
    password: "6969",
    isAdmin: true
}
];
let currUserEmail;
//Questions are stored in Json File
const QUESTIONS = JSON.parse(jsonQues)

const SUBMISSION = []

app.get("/", function (req, res) {
    res.render('index')
})

app.post('/signup', function (req, res) {
    // Add logic to decode body
    const email = req.body.email
    const password = req.body.pass
    // body should have email and password
    if (email == "" || password == "") {
        res.status(404)
        res.send("please enter correct email and password")
    }
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    USERS.push({ email, password })
    // return back 200 status code to the client
    res.status(200)
    res.send("signed up")
})

app.post('/login', function (req, res) {
    // Add logic to decode body
    const email = req.body.email
    currUserEmail = req.body.email
    const password = req.body.pass
    // body should have email and password
    if (email == "" || password == "") {
        // res.status(404)
        res.send("please enter correct email and password")
    }
    // Check if the user with the given email exists in the USERS array
    const result = USERS.find((el) => {
        return el.email === email
    })
    if (result) {
        // Also ensure that the password is the same
        // If the password is the same, return back 200 status code to the client
        if (result.password == password) {
            res.status(200)
            // Also send back a token (any random string will do for now)
            setTimeout(() => {
                res.redirect('/questions')
            }, 500)
        }
        else {
            // If the password is not the same, return back 401 status code to the client
            res.status(401)
            res.send("incorrect email id and password ")
        }
    }
})
app.get('/questions/:id', function (req, res) {
    let id = req.params.id
    let question = QUESTIONS[id]
    let { title, difficulty, description } = question
    //return the user all the questions in the QUESTIONS array
    res.render('question', { title, difficulty, description })
})

app.get('/questions', function (req, res) {
    //return the user all the questions in the QUESTIONS array
    res.render('questions', { QUESTIONS })
})

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    const isAccepted = Math.random();
    console.log(isAccepted);
    if (isAccepted < 0.5) {
        res.status(201).send(`
        <h2>submission Accepted</h2>
        <h3>Your previous Submission</h3>
        <p>${SUBMISSION[SUBMISSION.length - 1]}</p>
        <button><a href="/questions">All Questions</a></button>
        `);
    } else {
        res.status(400).send("<h1>submission Rejected</h1>");
    }
});


app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    let userSubmission = req.body.submission;
    SUBMISSION.push(userSubmission)
    // Store the submission in the SUBMISSION array above
    res.redirect('/submissions')
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.get('/admin', (req, res) => {
    let userIndex = USERS.findIndex((el) => {
        return el.email == currUserEmail
    })
    let isAdmin = USERS[userIndex].isAdmin === true
    if (isAdmin) {
        res.send(`
        <h1>Add a new Problem</h1>
        <form action="/admin" method="post">
        Title: <input name="title"><br>
        Acceptance: <input name="acceptance"><br>
        Difficulty: <input name="difficulty"><br>
        Description:  <textarea name="description" id="input-area"></textarea>
        <br>
                <button type="submit">Submit</button>
            </form>
        `)
    }
    res.send("Only Admin can Access this page")
})

app.post('/admin', (req, res) => {
    let newProblem = []
    newProblem.push(req.body)
    QUESTIONS.push(newProblem)
    res.send('Added')
})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})