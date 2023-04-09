const express = require('express');
const app = express();

// dot env setup
require('dotenv').config({ path: './config/config.env' });

// Set the port
const PORT = process.env.PORT || 3000;

// Set the global variables
global.USERS = [];
global.QUESTIONS = [];
global.SUBMISSIONS = [];

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//importing our routes
const user = require('./routes/users');
const submission = require('./routes/submissions');
const question = require('./routes/questions');


//using our routes
app.use("/", user);
app.use("/", submission);
app.use("/", question);

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
