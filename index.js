const express = require('express')
const app = express()
const port = 3000

// Middleware to parse JSON bodies
app.use(express.json());

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

    // Add logic to decode body
    // body should have email and password
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Email and password are required');
    }

    const key = 'email'; // Key for which you want to extract the values

    const signedUpEmailList = USERS.map(item => item[key]);

    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)

    if (signedUpEmailList.includes(req.body.email)) {
        res.send("User already exists");
    } else {
        USERS.push({
            email: req.body.email,
            password: req.body.password
        })
        res.send("User successfully created");
    }
    res.status(200);
    // return back 200 status code to the client

    console.log(USERS);
});

app.post('/login', function (req, res) {
    // Add logic to decode body
    // body should have email and password

    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Email and password are required');
    }

    let fetchedUser = null;
    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    // If the password is not the same, return back 401 status code to the client
    USERS.forEach((e) => {
        if (e.email === req.body.email) {
            if (e.password === req.body.password) {
                fetchedUser = e;
            } else {
                return res.status(401).send("Incorrect password");
            }
        }
    });

    if (fetchedUser != null) {
        return res.status(200).send({
            token: "Base64 Token",
            body: "User successfully logged in!"
        });
    } else {
        return res.status(400).send("Please give correct emailId");
    }

});

app.get('/questions', function (req, res) {

    //return the user all the questions in the QUESTIONS array
    res.status(200).send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
    // return the users submissions for this problem
    res.status(200).send(SUBMISSION);
});


app.post("/submissions", function (req, res) {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above

    const { problemId, solution } = req.body;

    const acceptanceCriteria =Math.random()*100;
    if(acceptanceCriteria>50){
        SUBMISSION.push({problemId:problemId, solution:solution});
        res.send("Solution Accepted")
    }
    else {
        res.send("Please correct the solution");
    }
    res.status(200);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// Middleware for authentication and authorization
const isAdmin = (req, res, next) => {
    // Check if user is authenticated and is an admin
    // You can implement your own logic here to determine admin status
    const isAuthenticated = true; // Example: Assume user is authenticated
    const isAdminUser = true; // Example: Assume user is an admin

    if (isAuthenticated && isAdminUser) {
        // User is authenticated and is an admin, proceed to the next middleware/route handler
        next();
    } else {
        // User is not authorized, send a response with an error message
        res.status(403).send('Access Denied');
    }
};

// Protected route accessible only by admins
app.get('/add-problems', isAdmin, (req, res) => {
    const {title, description, testCases} = req.body;
    const question = {title, description, testCases}
    QUESTIONS.push(question);
    res.status(202).send("Question created successfully");
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})