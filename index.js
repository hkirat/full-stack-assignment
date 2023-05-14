const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;

const jsonParser = bodyParser.json()

const User = [];
const Questions = [
    {
        questionId: 1,
        title: "Two status",
        description: "Given an array, return the maximum of the array?",
        testCases: [{
            input: "[1, 2, 3, 4, 5]",
            output: "5"
        }]
    }
];
const Submissions = [];

function validateRequest(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("Email and password is required.");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(req.body.email)) {
        return res.status(400).send("Enter a valid email");
    }

    next();
}


app.post('/signup',jsonParser, validateRequest, function(req, res) {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    for (let i in User) {
        if(User[i].email === email) {
            return res.status(400).send("Email already exists");
        }
    }
    User.push({email: email, password: password});
    console.log(User);
    res.status(200).send("successful");
});

app.post('/login', jsonParser, validateRequest, (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password
    for (let i in User) {
        if(User[i].email == email) {
            if (User[i].password == password) {
                const token = jwt.sign({email: email}, 'secret-key');
                return res.status(200).header('secret-key', token).send('Login successfully');
            } else {
                return res.status(401).send('Invalid password');
            }
        }
    }
    res.status(401).send('Invalid Email');
});

app.get('/questions', function(req, res) {
    res.send(Questions);
});

app.get('/submissions', function(req, res) {
    res.send(Submissions);
});

app.post('/submissions',jsonParser, function(req, res) {
    const body = req.body;
    if (!body.questionId || !body.code) {
        return res.status(400).send('body should have a questionId and code');
    }
    for (let i in Questions) {
        if (Questions[i].questionId == body.questionId) {
            if (Math.floor(Math.random() * 2) === 0) {
                Submissions.push({questionId: body.questionId, code: body.code, status: "Accepted"})
                console.log(Submissions);
                return res.status(200).send('Submitted');
            } else {
                Submissions.push({questionId: body.questionId, code: body.code, status: "Rejected"});
                console.log(Submissions);
                return res.status(200).send('Submitted');
            }
        }
    }
    console.log(Submissions)
    return res.status(400).send('Invalid questionId');
})

app.listen(PORT, function() {
    console.log(`example app is running on port ${PORT}`);
});