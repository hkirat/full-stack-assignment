const express = require('express')
const app = express()
const port = 3000

// use the express.json() middleware to parse the body of the request
app.use(express.json());

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
    {
        title: "Three states",
        description: "Given an array , return the minimum of the array?",
        testCases: [{
            input: "[1,2,3,4,5]",
            output: "1"
        }]
    }];


const SUBMISSION = [

]

const ADMINS = [
    {
        email: 'admin@gmail.com',
        password: 'admin'
    }
]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
    // Check for existing email in the users array
    // If the email exists, return back 200 response and redirect them to login page
    // If the email doesnt exist, return back 200 response and redirect them to signup page
    const { email, password } = req.body;
    const user = USERS.find(user => user.email === email);

    if (user) {
        res.status(200).send('User already exists, Please visit login page');
    }

    let count = USERS.length;
    count++;

    USERS.push({ 'email': email,
        'password': password,
        'count': count});
    res.status(200).send('User created successfully, Please visit login page');
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
    console.log(req.body)
  const { email, password } = req.body;
    const user = USERS.find(user => user.email === email);

    if(!user) {
        res.status(401).send('User does not exist');
    }
    if(user.password !== password) {
        res.status(401).send('Password is incorrect');
    }
    res.status(200).send(`Login successful use this token to access protected routes- ${user.count}` );
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
    res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    const { query } = req;
    const { token } = query;
    const user = USERS.find(user => user.count === token);
    if(!user) {
        res.status(401).send('User does not exist');
    }

const submissions = SUBMISSION.find(submission => submission.token === token);
    if(!submissions) {
        res.status(401).send('No submissions found');
    }
    res.status(200).send(submissions.submissions);

  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const { body } = req;
    const { token, submission } = body;
    const user = USERS.find(user => user.count === token);
    if(!user) {
        res.status(401).send('User does not exist');
    }
    const submissions = SUBMISSION.find(submission => submission.token === token);
    if(!submissions) {
        SUBMISSION.push({ 'token': token,
            'submissions': [submission]});
        res.status(200).send('Submission successful');
    }
    submissions.submissions.push(submission);
    res.status(200).send('Submission successful');
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/addQuestion', function(req, res) {
    const { body } = req;
    const { email, password, question } = body;
    const admin = ADMINS.find(admin => admin.email === email && admin.password === password);
    if(!admin) {
        res.status(403).send('You are not an admin');
    }
    QUESTIONS.push(question);
    res.status(200).send('Question added successfully');
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
