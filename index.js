const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); //When a form is submitted with the method "POST" and the encoding type is set to "application/x-www-form-urlencoded", the data from the form is sent as a URL-encoded string in the request body. The bodyParser middleware parses this data and populates the req.body object with the parsed data.
                                                    // The extended option specifies whether the parser should use the querystring library (when false) or the qs library (when true) to parse the URL-encoded data. The qs library allows for richer parsing options, such as nested objects and arrays, whereas the querystring library only supports simple key-value pairs.
const signupRoutes = require('./signup');
const loginRoutes = require('./login')
const questionsRoutes = require('./questions')
const submissionsRoute = require('./submissions')

// setting up endpoints
app.use('/', signupRoutes);
app.use('/', loginRoutes);
app.use('/', questionsRoutes);
app.use('/', submissionsRoute)

app.listen(port, function () {
  console.log(`Example app listening on port ${port}....`)
})