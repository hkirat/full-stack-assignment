const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000;




// Import the route handlers
const signupRoutes = require('./routes/auth/signup');
const loginRoutes = require('./routes/auth/login');
const questionRoutes = require('./routes/questions/questions');
const submissionRoutes = require('./routes/submissions/submissions');
const adminRoutes = require('./routes/admin/admin');

// Use the route handlers
app.use(signupRoutes);
app.use(loginRoutes);
app.use(questionRoutes);
app.use(submissionRoutes);
app.use(adminRoutes);
app.use(bodyParser.json());




// Start the server
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});