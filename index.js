const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const secretKey = "Gokul's Secret key"
const users = [
    {
        userId: 1,
        username: 'user1',
        password: 'password1',
        isAdmin: false
    },
    {
        userId: 2,
        username: 'user2',
        password: 'password2',
        isAdmin: false
    },
    {
        userId: 3,
        username: 'user3',
        password: 'password3',
        isAdmin: true
    }
];

const questions = [
    {
        quesId: 1,
        title: "Question 1",
        content: "This is Question 1",
        testCase: [
            {
                input: "[1, 2, 3, 4, 5]",
                output: "5"
            }
        ]
    },
    {
        quesId: 2,
        title: "Question 2",
        content: "This is Question 2",
        testCase: [
            {
                input: "[1, 2, 3, 4, 5]",
                output: "5"
            }
        ]
    },
    {
        quesId: 3,
        title: "Question 3",
        content: "This is Question 3",
        testCase: [
            {
                input: "[1, 2, 3, 4, 5]",
                output: "5"
            }
        ]
    }
];

const submission = [
    {
        userId: 1,
        quesId: 1,
        answer: "answer 1 by user 1",
        result: "Correct Answer",
        passedTestCases: 100,
        totalTestCases: 100
    },
    {
        userId: 2,
        quesId: 1,
        answer: "answer 1 by user 2",
        result: "Time limited error",
        passedTestCases: 200,
        totalTestCases: 300
    },
    {
        userId: 1,
        quesId: 3,
        answer: "answer 3 by user 1",
        result: "Wrong answer",
        passedTestCases: 0,
        totalTestCases: 100
    },
]

const generateNewUserId = () => {
    const maxId = Math.max(0, ...users.map(user => user.userId));
    const newId = maxId + 1;
    return newId;
}

const submissions = [];
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);
            req.userId = decoded.userId;
            next();
        } catch (e) {
            res.status(401).json({ error: "invalid token" });
        }
    } else {
        res.status(401).json({ error: "Missing token" });
    }
}

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    const userFound = users.find(user => user.username === username);
    if (userFound) {
        res.status(404).json({ error: "User already exist" });
    }

    const userId = generateNewUserId();
    const newUser = {
        userId,
        username,
        password,
        isAdmin: false
    };
    users.push(newUser);
    res.status(201).json({ message: "User created successfully" });
})

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const userFound = users.find(user => user.username === username && user.password === password);

    if (userFound) {

        const jwtToken = jwt.sign({ userId: userFound.userId, username: userFound.username }, secretKey);
        res.status(200).json({ token: jwtToken, message: "Login Successful" });
    } else {
        res.status(401).json({ error: "Invalid username or password" });
    }
})

app.get("/questions", (req, res) => {
    res.json({ questions });
})

app.get("/questions/:quesId", (req, res) => {
    const quesId = req.params.quesId;
    const ques = questions.find(q => q.quesId === quesId);
    res.json({ ques });
})

app.post("/submit-question", authenticateUser, (req, res) => {
    const userId = req.userId;
    const user = users.find(u => u.userId === userId);

    if (user && user.isAdmin) {
        res.status(200).json({ message: "Question submitted successfully" });
    } else {
        res.status(403).json({ error: "Not authorized" });
    }
})

app.post("/submit-answer/:quesId", authenticateUser, (req, res) => {
    const userId = req.userId;
    const quesId = req.params.quesId;
    const answer = req.body.answer;

    const { result, passedTestCases, totalTestCases } = checkSubmission(req.body);
    const submission = {
        userId,
        quesId,
        answer,
        result,
        passedTestCases,
        totalTestCases
    }
    submissions.push(submission);
    res.status(200).json({ success: true, message: "Answer submitted successfully" });
})

app.get('/results/:quesId', authenticateUser, (req, res) => {
    const userId = req.userId;
    const quesId = req.params.quesId;
    const userSubmissions = submission.filter(sub => sub.quesId === quesId && sub.userId === userId);

    if (userSubmissions.length > 0) {
        const submission = userSubmissions[userSubmissions.length - 1];
        res.status(200).json({ submission });
    } else {
        res.status(400).json({ error: "No submissons for this answer" });
    }
});

app.get("/submission", authenticateUser, (req, res) => {
    const userId = req.userId;
    const userSubmissions = submission.filter(sub => sub.userId === userId);
    res.status(200).json({ userSubmissions });
}),

    app.listen(port, () => {
        console.log(`App listening to port ${port}`);
    })