const express = require('express')
const app = express()
const port = 3001


app.use(express.json());

const USERS = [
    {
        email: "sbharath35@gmail.com",
        password: "openSource@99"
    }, {
        email: "reddy@gmail.com",
        password: "openSourceIsCool@#12"
    }];

const QUESTIONS = [
    {
        title: "Two states",
        description: "Given an array , return the maximum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]", output: "5"
        }]
    }];


const SUBMISSION = [{
    userId: "1", questionId: "1", code: "function max(arr) {return Math.max(...arr)}", status: "accepted"
}]

const ERRORS = {
    MISSING_DETAILS: {code: 403, message: 'Please provide both email and password.'},
    WRONG_CREDENTIALS: {code: 403, message: 'Invalid email or password.'},
    USER_NOT_FOUND: {code: 404, message: 'User not found.'},
    INVALID_SUBMISSION: {code: 400, message: 'Invalid submission. Please check your details and try again.'},
    SERVER_ERROR: {code: 500, message: 'Internal server error. Please try again later.'},

};

app.post('/signup', async (req, res) => {
    try {

        const {email, password} = req.body;
        const existingUser = USERS.find(user => user.email === email);

        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        USERS.push({email, password});

        res.status(200).send('User created successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})


app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            res.status(ERRORS.MISSING_DETAILS.code).json({error: ERRORS.MISSING_DETAILS.message});
            return;
        }

        const user = USERS.find(u => u.email === email);

        if (!user) {
            res.status(ERRORS.USER_NOT_FOUND.code).json({error: ERRORS.USER_NOT_FOUND.message});
            return;
        }

        const passwordMatch = password === user.password;

        if (passwordMatch) {
            res.status(200).send(`${email} logged in successfully!`);
            return;
        }

        res.status(ERRORS.WRONG_CREDENTIALS.code).json({error: ERRORS.WRONG_CREDENTIALS.message});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error.'});
    }
});

app.get('/questions', (req, res) => {
    res.json(QUESTIONS);
})

app.get("/submissions", (req, res) => {
    res.json(SUBMISSION)
});


app.post('/submissions', (req, res) => {
    try {
        const {userId, questionId, code, status} = req.body;
        const isAccepted = Math.random() < 0.5;
        if (userId && questionId && code && status) {
            SUBMISSION.push({
                userId,
                questionId,
                code,
                status,
                isAccepted,
            });
            res.status(201).json({message: 'Submission added successfully'});
        } else {
            res.status(400).json({error: 'Please provide userId, questionId, code, and status.'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error.'});
    }
});


//List of admin email addresses
const ADMIN_EMAILS = ['admin@example.com', 'superuser@example.com'];

// Create a route that lets an admin add a new problem
app.post('/problems', (req, res) => {
    // Check if user is authenticated
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).send('Authentication required');
    }

    // Check if user is an admin
    const admin = isAdmin(authorization);
    if (!admin) {
        return res.status(403).send('You do not have permission to perform this action');
    }

    // Add the new problem to the Array
    const {title, description, testCases} = req.body;
    const newProblem = {title, description, testCases};
    QUESTIONS.push(newProblem);

    // Return a success message to the client
    res.status(201).send('Problem created successfully');
});


// Helper function to check if a user is an admin
function isAdmin(userEmail) {
    return ADMIN_EMAILS.includes(userEmail);
}


app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})