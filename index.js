const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [
            {
                input: "[1,2,3,4,5]",
                output: "5",
            },
        ],
    },
];

const SUBMISSION = [];

app.get("/", function (req, res) {
    res.send("<html><body><h1>Back End Assignment</h1></body></html>");
});

app.post("/signup", function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)
    const existingUser = USERS.find((user) => user.email === email);
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        email: email,
        password: hashedPassword,
        isAdmin: isAdmin,
    };

    if (!existingUser) {
        USERS.push(newUser);
        console.log(USERS);
    } else {
        console.log("User Already Exists, please try logging in");
    }

    // return back 200 status code to the client
    res.status(200).json(newUser);
});

app.post("/login", async function (req, res) {
    // Add logic to decode body
    // body should have email and password
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user with the given email exists in the USERS array
    const existingUser = USERS.find((user) => user.email === email);
    console.log(existingUser);

    // Also ensure that the password is the same
    if (existingUser && bcrypt.compareSync(password, existingUser.password, 10)) {
        // Password is correct, generate a random token
        const token = await bcrypt.genSalt(10);

        // If the password is the same, return back 200 status code to the client
        // Also send back a token (any random string will do for now)
        res.status(200).json({ email: email, token: token });
    } else {
        // If the password is not the same, return back 401 status code to the client
        res.status(401).send("Unauthorized");
    }
});

app.get("/questions", function (req, res) {
    //return the user all the questions in the QUESTIONS array
    res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
    // Assuming you have the user's ID available
    const userId = req.query.userId; // Assuming the user ID is passed as a query parameter

    // Retrieve the user's submissions for this problem using their ID
    const userSubmissions = SUBMISSION.filter((submission) => submission.userId === userId);

    // Return the user's submissions in the response
    res.status(200).json(userSubmissions);
});

app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    const userId = req.body.userId;
    const submission = req.body.submission;

    // Generate a random boolean value to simulate acceptance or rejection
    const isAccepted = Math.random() < 0.5; // Adjust the probability as desired

    // Store the submission in the SUBMISSION array above
    SUBMISSION.push({ userId: userId, submission: submission, isAccepted: isAccepted });

    // Return the response based on acceptance or rejection
    if (isAccepted) {
        res.status(200).send("Submission accepted");
    } else {
        res.status(400).send("Submission rejected");
    }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

//middleware function to authenticate and authorize admins
function isAdmin(req, res, next) {
    // Check if the user is an admin (you should implement this logic based on your authentication system)
    const isAdmin = req.body.user.isAdmin; // Assuming isAdmin property exists in the user object

    if (isAdmin) {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // User is not an admin, return a 401 Unauthorized status
        res.status(401).send("Unauthorized");
    }
}

// Route to add a new question (accessible only by admins)
app.post("/questions", isAdmin, function (req, res) {
    // Assuming the request body contains the new question details
    const newQuestion = req.body.problem;

    // Add the new question to the QUESTIONS array
    QUESTIONS.push(newQuestion);

    // Return a success message or the updated QUESTIONS array
    res.status(200).send("Question added successfully");
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
});
