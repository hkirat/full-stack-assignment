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

const AdminList = [];

const SUBMISSION = [];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {username , email , password , isAdmin} = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const Exist = USERS.find(user => user.email == email)
  if (Exist) { 
    return res.status(400).send("Account already exists")
  }

  const NewUser = {email , password}
  USERS.push(NewUser)

  // if user is admin add username to admin list
  if (isAdmin)  {
    AdminList.push(username)
  }

  // return back 200 status code to the client
  return res.status(201).send('Account has been successfully created')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email , password } = req.body;
  

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email == email)

  if (!user) { 
    return res.status(404).send('Email not found.');
  }

  // Also ensure that the password is the same
  if (user && user.password == password) {

    const token = Math.random().toString(12).substring(5);

    user.token = token;

    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(200).send(token);
  } 

  // If the password is not the same, return back 401 status code to the client
  res.status(401).send('Incorrect Password. Please try again')

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
  const problemid = req.query.problemid;

  const submission = SUBMISSION.filter(sub => sub.questionid == problemid);

  res.send(submission)
  
});


app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { sol , userid , questionid} = req.body;

  if (Math.random > 0.5) { 

    const status = 'accepted'
    const sub = {sol, userid , questionid , status}
    SUBMISSION.push(sub);

    res.status(201).send('Your Submission has been accepted and successfully stored')
  }
  
  res.status(400).send('Your submission has been rejected.')
   // Store the submission in the SUBMISSION array above
  
});

// leaving as hard todos

// Create a route that lets an admin add a new problem
app.post('/AdProblem' , function(req , res) {
  
  const { user, title , description , testcase}  = req.body;
  
  // ensure that only admins can do that.
  if (AdminList.includes(user)) {
    const Problem = { title , description , testcase}

    QUESTIONS.push(Problem)

    res.status(201).send('New problem has been successfully added')

  }

  res.status(401).send('This is an Admin-Only action')
  

});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})