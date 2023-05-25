const express = require('express')
const app = express()
const port = 3000

const USERS = []

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array.",
    testCases: [{
        input: "[1, 2, 3, 4, 5]",
        output: "5"
    }]
}]

const SUBMISSIONS = [{
    user: "user1",
    problem: "Two states",
    solution: "5",
    accepted: true
}]

app.use(express.json())

app.post('/signup', (req, res) => {

    console.log(req.body)
    const {email, password} = req.body

    if(USERS.find(user => user.email === email)) {
        res.status(409).send('Email already exists.')
    }
    else {
        USERS.push({email, password})
        res.status(200).send('User created.')
    }
})

app.post('/login', (req, res) => {

    const {email, password} = req.body

    const user = USERS.find(user => user.email === email);
    if(user) {
        if(user.password === password) {
            const token = Math.random().toString(36).substring(7);
            res.status(200).send({
                token,
                user
            })
        }
        else {
            res.status(401).send('Invalid credentials.')
        }
    }
    else {
        res.status(408).send('Email doesn\'t exist.')
    }
 })

app.get('/questions', (req, res) => {

    res.status(200).send(QUESTIONS)

})

app.get('/submissions', (req, res) => {

    res.status(200).send(SUBMISSIONS)

})

app.listen(port, () => {

    app.post('/submissions', (req, res) => {

        const { user, problem, solution } = req.body;

        const accepted = Math.random() > 0.5;

        SUBMISSIONS.push({
            user,
            problem,
            solution,
            accepted
        });

        res.status(200).send(accepted);
    });

    console.log('Example app listening on port ${port}')
})