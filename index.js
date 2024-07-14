const express = require('express');
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.use(express.json());

app.post('/signup', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const identity = req.body.identity;
    const userExist = USERS.find(user => user.email === email);

    if (userExist != undefined) {
        res.status(400).json({
            msg: "User already exists"
        })
    } else {
        USERS.push({
            email: email,
            password: password,
            identity: identity
        })
        res.status(200).send();
    }
});

app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const userExist = USERS.find(user => user.email == email && user.password == password);

    if (userExist != undefined) {
        if (userExist.identity === "Admin") {
            res.status(200).json({
                token: "admin_k3bksbk21erfbvo5i"
            });
        } else {
            res.status(200).json({
                token: "hustle_kh47r7fgvajvv"
            })
        }
    } else {
        res.status(400).json({
            msg: "Invalid email or password"
        })
    }
});

app.get('/questions', function (req, res) {
    res.json({ QUESTIONS });
})

app.get("/submissions", function (req, res) {
    const id = req.query.id;
    const submission = SUBMISSION.find(item => item.id === id);

    if (submission != undefined) {
        res.status(200).json(submission);
    } else {
        res.status(404).json({
            msg: "No submissions found"
        });
    }
});

app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    const submission = req.body.submission;
    const id = req.body.id;
    const idExist = SUBMISSION.find(item => item.id === id);

    const random = Math.floor(Math.random() * 100000);

    if (random % 2 === 0) {
        if (idExist == undefined) {
            SUBMISSION.push({
                id: id,
                submissions: [submission]
            })
        } else {
            idExist.submissions.push(submission);
        }
        res.json({
            msg: "Submitted"
        });
    } else {
        res.json({
            msg: "Submission rejected"
        });
    }
});

app.post("/questions", (req, res) => {
    // leaving as hard todos
    // Create a route that lets an admin add a new problem
    // ensure that only admins can do that.
    const auth = req.headers.authorization;
    if (auth === "admin_k3bksbk21erfbvo5i") {
        QUESTIONS.push({
            title: req.body.title,
            description: req.body.description,
            testCases: req.body.testCases
        })
        res.status(201).json({
            msg: "created"
        });
    } else {
        res.status(401).json({
            msg: "You don't have access to add new problems"
        })
    }
});
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})
