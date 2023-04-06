require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

//common middlewares
app.use(express.json());

//routes
const user = require('./routes/userRoute');
const questions = require('./routes/questionsRoute');
const submissions = require('./routes/submissionRoute');

app.use('/api/v1', user);
app.use('/api/v1', questions);
app.use('/api/v1', submissions);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
