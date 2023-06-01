const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


// Import the route handlers
const signupRoutes = require('./routes/auth/signup');
const loginRoutes = require('./routes/auth/login');
const submissionRoutes = require('./routes/submissions/submissions');
const adminRoutes = require('./routes/admin/admin');

// Use the route handlers
app.use(signupRoutes);
app.use(loginRoutes);
app.use(submissionRoutes);
app.use(adminRoutes);
app.use(bodyParser.json());



// Start the server
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});