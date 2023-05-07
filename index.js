const express = require('express')
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


const SUBMISSION = [ ];
app.use(express.json());

//signup route
app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
    const { email, password } = req.body;

    const userExists = USERS.some(user => user.email === email);
    if (userExists) {
        res.status(400).send('User already exists');
        return;
    }

    const newUser = { email, password };
    USERS.push(newUser);
    //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

    res.status(200).send('Signup successful');
    // return back 200 status code to the client
});




// login route

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

    const { email, password } = req.body;

    const user = USERS.find(user => user.email === email);

    if (!user || user.password !== password) {
        res.status(401).send('Invalid email or password');
        return;
    }

    res.status(200).send('Login successful');
});
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client



app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
    res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
    const { problemID } = req.query;
    const submission = SUBMISSION.filter(submission => submission.problemID === problemID);
    res.status(200).json(submission);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const { problemID, solution } = req.body;
   const isAccepted = Math.random() <0.5;
   const newSubmission ={ problemID, solution, isAccepted};
   SUBMISSION.push(newSubmission);
   res.status(200).send('Submission recieved');
    // Store the submission in the SUBMISSION array above
});

app.post('/problem', function (){
    const isAdmin = true;
    if(!isAdmin){
        res.status(403).send('Unauthorized');
        return;
    }
    const {title, description, testCases} = req.body;
    const newProblem = {title, description, testCase};
    QUESTIONS.push(newProblem);
    res.status(200).send('Problem added successfully');
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})