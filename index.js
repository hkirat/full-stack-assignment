const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Import the route handlers
const signupRoutes = require('./routes/auth/signup');
const loginRoutes = require('./routes/auth/login');
const questionRoutes = require('./routes/questions/questions');
const submissionRoutes = require('./routes/submissions/submissions');
const adminRoutes = require('./routes/admin/admin');

//You can't use body parser under app.use routes, it must be before them.
// If you put app.use(bodyParser.json()); to the bottom,
// req.body will always be undefined in your routes!!!!
app.use(bodyParser.json());
// Use the route handlers
app.use(signupRoutes);
app.use(loginRoutes);
app.use(questionRoutes);
app.use(submissionRoutes);
app.use(adminRoutes);

// Start the server
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
});
