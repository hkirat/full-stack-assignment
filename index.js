const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");
const cookieParser = require("cookie-parser");
const port = 3001;

const USERS = [];

const QUESTIONS = [
    {
        id: 0,
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [
            {
                input: "[1,2,3,4,5]",
                output: "5",
            },
        ],
    },
    {
        id: 1,
        title: "Two Sum",
        description:
            "Given an array of integers, find two numbers such that they add up to a specific target.",
        testCases: [
            {
                input: [2, 7, 11, 15],
                output: [0, 1],
            },
            {
                input: [3, 2, 4],
                output: [1, 2],
            },
        ],
    },
];

const SUBMISSIONS = [];

app.use(express.json());
app.use(cookieParser());

app.post("/signup", (req, res) => {
    const { email, password, role } = req.body;
    !(email && password) &&
        res.status(400).json({
            success: false,
            message: "Email/ password cannot be undefined/ null",
        });
    let exists = false;
    USERS.forEach((user) => user.email === email && (exists = true));
    !exists
        ? USERS.push({ email, password, role }) &&
          res.status(200).json({ success: true })
        : res.status(400).json({
              success: false,
              error: "User with given email already exists",
          });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = USERS.filter((user) => user.email === email)[0];

    user
        ? user.password === password
            ? res
                  .status(200)
                  .cookie("TOKEN", uuid(), { httpOnly: true })
                  .cookie("ROLE", user.role, { httpOnly: true })
                  .json({
                      success: true,
                      message: "Login successful",
                  })
            : res
                  .status(401)
                  .json({ success: false, error: "Incorrect password" })
        : res.status(404).json({
              success: false,
              error: "User with given email does not exist",
          });
});

app.get("/questions", (req, res) => {
    res.status(200).json({
        success: true,
        questions: QUESTIONS,
    });
});

app.get("/submissions", (req, res) => {
    res.status(200).json({ success: true, SUBMISSIONS });
});

app.post("/submissions", (req, res) => {
    const { qID, submission } = req.body;
    let rand = Math.random();
    if (rand > 0.5) {
        rand = Math.ceil(rand);
    } else {
        rand = Math.floor(rand);
    }

    rand
        ? SUBMISSIONS.push({ qID, submission }) &&
          res.status(200).json({ success: true, message: "Solution accepted" })
        : res.status(400).json({ success: false, error: "Invalid solution" });
});

const isAdmin = (req, res, next) => {
    const { TOKEN, ROLE } = req.cookies;
    if (!(TOKEN && ROLE === "admin")) {
        res.status(404).json({ success: false, error: "Access unauthorised" });
    }
    next();
};
app.post("/questions", isAdmin, (req, res) => {
    const { title, description, testCases } = req.body;
    QUESTIONS.push({ id: uuid(), title, description, testCases });
    res.status(201).json({
        success: true,
        message: "Question added successfully",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
