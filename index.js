const express = require('express')
require('dotenv').config()
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const app = express()
app.use(express.json());

// in memory variable to store users, will be replaced with a database
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
    const {body} = req
    if (body.email && body.password) {
        //cheak if emai is already exist in the array
        if (USERS.find(user => user.email === body.email)) {
            return res.status(400).send("User already exists")
        } else {
            //add user to the array
            USERS.push(
                {
                    email: body.email,
                    password: bcrypt.hashSync(body.password, 12)
                }
            )
            res.status(200).send("User created successfully")
        }
    } else {
        res.status(400).send("Bad Request")
    }
})
app.post('/login', function (req, res) {
    const {body} = req
    if (body.email && body.password) {
        //check if email is already exist in the array
        if (USERS.find(user => user.email === body.email)) {
            //check if password is correct
            if (bcrypt.compareSync(body.password, USERS.find(user => user.email === body.email).password)) {
                res.status(200).send(
                    //send token to the user
                    {
                        token: jsonwebtoken.sign(
                            {email: body.email},
                            process.env.JWT_SECRET,
                            {expiresIn: "1h"}
                        )
                    }
                )
            } else {
                res.status(401).send("Unauthorized")
            }
        } else {
            res.status(401).send("Unauthorized")
        }
    }
})


app.get("/submissions", function (req, res) {
    res.status(200).send(SUBMISSION)
});
app.post("/submissions", function (req, res) {
    const {body} = req
    let submission = {
        question_titile: body.question_titile,
        code: body.code,
    }
    // let the user submit a problem, randomly accept or reject the solution
    const randomZeroOrOne = Math.floor(Math.random() * 2); // Output: either 0 or 1
    if (randomZeroOrOne) {
        res.status(200).send("Accepted")
    } else {
        res.status(400).send("Wrong Answer")
    }

    // Storing the submission in the SUBMISSION array above
    SUBMISSION.push(submission);
});

app.get('/questions', function (req, res) {
    //return the user all the questions in the QUESTIONS array
    res.status(200).send(QUESTIONS)

})
app.post("/questions", async function (req, res) {
    const {body} = req
    if (body.title && body.description && body.testCases) {
        //check if user is admin and verified
        if (req.headers.authorization) {
            //verify user
            //extract token from the header
            const token = req.headers.authorization.split(" ")[1];
            try {
            //verify token
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            //check if user exist on the array
                if (USERS.find(user => user.email === decoded.email)) {
                    //add question to the array
                    QUESTIONS.push(
                        {
                            title: body.title,
                            description: body.description,
                            testCases: body.testCases
                        }
                    )
                    res.status(200).send("Question created successfully")
                } else res.status(401).send("Unauthorized")
            } catch (e) {
                console.log(e)
            }
            //check if user exist on the array
        } else res.status(401).send("Unauthorized")
    } else res.status(400).send("Bad Request")

})
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})
