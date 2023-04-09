require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// let middleware = require(path.join(__dirname, 'middleware'))
app.use(cookieParser());

const usersDB = {
    // //alternate way
    users: require(path.join(__dirname, "model", "users.json")),
    setUsers: function(data) {
        this.users = data;
    },
};

const questionsDB = {
    // //alternate way
    questions: require(path.join(__dirname, "model", "questions.json")),
    setQuestions: function(data) {
        this.questions = data;
    },
};
const answersDB = {
    // //alternate way
    answers: require(path.join(__dirname, "model", "answers.json")),
    setAnswers: function(data) {
        this.answers = data;
    },
};

const fsPromises = require("fs").promises;
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));
app.get("/style.css", function(req, res) {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(path.join(__dirname, "public", "style.css"));
});
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");


app.get("/", function(req, res) {
    return res.redirect("/signup");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async(req, res) => {
    const { username, email, role, password } = req.body;
    if (!username || !password)
        return res.status(400).json({
            message: "Username and password are required.",
        });
    // console.log(USERS);
    const userCheck = usersDB.users.find((user) => user.username === username);
    if (userCheck) {
        return res.status(409).render("signup", {
            error: "User already exists",
        });
    } else {
        const hashedPwd = await bcrypt.hash(password, 10);
        // alternate way
        // store the new user
        const newUser = {
            username: username,
            email: email,
            role: role,
            password: hashedPwd,
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "model", "users.json"),
            JSON.stringify(usersDB.users)
        );

        return res.status(201).render("login", {
            success: `New user ${username} created!`,
        });
    }
});
app.get("/login", (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (accessToken && refreshToken) {
        // Access token already present, redirect to questions page
        return res.redirect("/questions");
    }
    res.render("login");
});

app.post("/login", async(req, res) => {
    const questionsFilePath = path.join(__dirname, "model", "questions.json");
    const questionsData = await fsPromises.readFile(questionsFilePath, "utf-8");
    const questions = JSON.parse(questionsData);
    // req.session.username = username;
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res.status(400).json({
            message: "Username and password are required.",
        });
    const foundUser = usersDB.users.find((person) => person.username === user);
    if (!foundUser)
        return res.status(409).render("login", {
            usrerror: "user not exists ",
        });
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (!match) {
        return res.status(409).render("login", {
            pwderror: "wrong password ",
        });
    }

    //create jwt
    const accessToken = jwt.sign({
            username: foundUser.username,
            role: foundUser.role,
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "9000s" }
    );
    const refreshToken = jwt.sign({
            username: foundUser.username,
            role: foundUser.role,
        },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 9000 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("/questions");
});

var authenticateToken = (req, res, next) => {
    // const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    // if (!authHeader) return res.sendStatus(401);
    // const token = authHeader.split(" ")[1];
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        return res
            .status(401)
            .json({ message: "Access token is missing. Log in Again" });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                // Access token has expired, try to use refresh token to generate new access token
                if (!refreshToken) {
                    return res
                        .status(401)
                        .json({ message: "Refresh token is missing. Log in again" });
                }

                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    (err, user) => {
                        if (err) {
                            return res
                                .status(403)
                                .json({ message: "Refresh token is invalid." });
                        }

                        // Refresh token is valid, generate new access token
                        const newAccessToken = jwt.sign({
                                username: user.username,
                                role: user.role,
                            },
                            process.env.ACCESS_TOKEN_SECRET, { expiresIn: "9000s" }
                        );

                        // Set new access token in cookie and send it to client
                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                            maxAge: 30 * 1000,
                        });
                        req.user = user;
                        next();
                    }
                );
            } else {
                return res.status(403).json({ message: "Access token is invalid." });
            }
        } else {
            req.user = user;
            next();
        }
    });
};
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const checkAdmin = (req, res, next) => {
    const user = req.user;

    if (user.role !== "admin") {
        return res
            .status(403)
            .json({
                message: "Unauthorized: You must be an admin to access this resource.",
            });
    }

    next();
};

app.get("/questions", authenticateToken, async(req, res) => {
    const user = req.user;
    const username = user.username;
    //return the user all the questions in the QUESTIONS array
    const questionsFilePath = path.join(__dirname, "model", "questions.json");
    const questionsData = await fsPromises.readFile(questionsFilePath, "utf-8");
    const questions = JSON.parse(questionsData);

    // Render the 'questions' view and pass the questions data to it
    res.render("questions", { questions, username });
});

app.get("/questions/:title", (req, res) => {
    const title = decodeURIComponent(req.params.title);
    const question = questionsDB.questions.find((q) => q.title === title);
    if (!question) {
        res.status(404).send("Question not found");
    } else {
        res.render("question-description", { question });
    }
});


//submissions for posting answers of problems
app.post("/answers/:title", authenticateToken, async(req, res) => {
    const { answer } = req.body;
    const title_answer = decodeURIComponent(req.params.title);

    if (!answer || !title_answer)
        return res.status(400).json({
            message: "answer is required.",
        });
    const question_for_answer = answersDB.answers.find(
        (que) => que.title === title_answer
    );

    if (!question_for_answer) {
        newAnswer = { title: title_answer, answers: [answer] };
        answersDB.setAnswers([...answersDB.answers, newAnswer]);
    } else {
        question_for_answer.answers.push(answer);
        answersDB.setAnswers([...answersDB.answers]);
    }
    //  title_answer.answers.push(answer);
    //creat new json object
    const acceptProbability = 0.5; // adjust this value to change the acceptance probability
    const isAccepted = Math.random() < acceptProbability;

    // create a response message based on whether the answer is accepted or rejected
    const responseMessage = isAccepted ? "Answer accepted" : "Answer rejected";
    //   answersDB.answers.push({ title, answers: [answer] });
    if (isAccepted) {
        await fsPromises.writeFile(
            path.join(__dirname, "model", "answers.json"),
            JSON.stringify(
                answersDB.answers.map((ans) => ({
                    title: ans.title,
                    answers: ans.answers,
                }))
            )
        );
    }
    // redirect back to the same page with a success message
    const questionDescriptionUrl = `/questions-description/${encodeURIComponent(
    title_answer
  )}?successMessage=${encodeURIComponent(responseMessage)}`;


    res.redirect(questionDescriptionUrl);
});

app.get(
    "/questions-description/:title",
    authenticateToken,
    async(req, res) => {
        const title = decodeURIComponent(req.params.title);

        const questionsDB = require(path.join(
            __dirname,
            "model",
            "questions.json"
        ));
        const question = questionsDB.find((q) => q.title === title);

        if (!question) {
            return res.status(404).send("Question not found");
        }

        res.render("question-description", {
            question,
            successMessage: req.query.successMessage,
        });
    }
);


app.get("/addquestions", authenticateToken, checkAdmin, (req, res) => {
    res.render("addquestions");
});

app.post("/addquestions", authenticateToken, checkAdmin, async(req, res) => {
    const { title, description, tags, level, input, output } = req.body;

    if (!title || !description || !tags || !level || !input || !output)
        return res.status(400).json({
            message: "One of the field is empty",
        });

    const questionCheck = questionsDB.questions.find(
        (question) => question.title === title
    );

    if (questionCheck) {
        return res.status(409).render("signup", {
            questionerror: "question already exists",
        });
    }
    const newQuestion = {
        title,
        description,
        tags,
        level,
    };
    const testCases = {
        input,
        output
    };
    questionsDB.questions.push({
        title,
        description,
        tags,
        level,
        testCases: [{ input, output }]
    });
    // questionsDB.setQuestions([...questionsDB.questions, newQuestion]);
    // title.testCases.push(testCases);
    await fsPromises.writeFile(
        path.join(__dirname, "model", "questions.json"),
        JSON.stringify(questionsDB.questions)
    );

    return res.status(201).render("addquestions");
});

app.get("/submissions/:title", function(req, res) {
    const title = decodeURIComponent(req.params.title);
    const matchingQuestion = answersDB.answers.find((q) => q.title === title);

    if (!matchingQuestion) {
        res.status(404).send("No Submissions found.");
        return;
    }

    res.render("submissions", { answer: matchingQuestion });
    // return the users submissions for this problem
});

// app.post("/submissions", function(req, res) {
//     // let the user submit a problem, randomly accept or reject the solution
//     // Store the submission in the SUBMISSION array above
//     res.send("Hello World from route 4!");
// });


app.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/login");
});
app.listen(port, function() {
    console.log(`Example app listening on port ${port}`);
});