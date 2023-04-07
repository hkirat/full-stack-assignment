const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    email: "xyz@abc.com",
    password: "2193#$%^" }
];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []
app.use(express.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email,password } = req.body

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const ExistingUser = USERS.find((user)=>user.email==email)

  // If user already exit return
  if(ExistingUser){
    return res.status(409).send("This email address already exists");
  }
  USERS.push({ email, password });
  // return back 200 status code to the client
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // checking if the email and password were included in the request body
  if (!email || !password) {
    return res.status(400).send("Both Email and Password required");
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const ExistingUser = USERS.find((user)=>user.email==email && user.password === password)

  // If the password is not the same, return back 401 status code to the client
  if(!ExistingUser){
    return res.status(401).send("Invalid userID or Password");
  }
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const loginToken = Math.random().toString(11);
  res.status(200).json({ loginToken });
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const { problemId, userId, code } = req.body;

   if (!problemId || !userId || !code) {
     return res.status(400).send("Problem ID, user ID, and code are required");
   }
 
   const newSubmission = { id: SUBMISSIONS.length + 1, problemId, userId, code };
   SUBMISSIONS.push(newSubmission);
   res.status(201).json(newSubmission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// Create an array of admin user IDs
const ADMIN_IDS = [1, 2, 3];

// POST request to add a new problem
app.post("/problems", function (req, res) {
  const { title, description, testCases } = req.body;

  // Check if the user making the request is an admin
  const userId = req.headers["user-id"];
  if (!ADMIN_IDS.includes(parseInt(userId))) {
    return res.status(401).send("Only admins can add new problems");
  }

  // Check that all required fields are present in the request body
  if (!title || !description || !testCases) {
    return res
      .status(400)
      .send("Title, description, and test cases are required");
  }

  // Create a new problem object and add it to the PROBLEMS array
  const newQuestion = { id: QUESTIONS.length + 1, title, description, testCases };
  QUESTIONS.push(newQuestion);
  res.status(201).json(newQuestion);
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})