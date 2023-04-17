const express = require('express')
const app = express()
const port = 3001

app.use(express.json());
// Store User here
const USERS = [];

// Questions are stored here
const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];


const SUBMISSION = [

]

app.get('/', (req, res) => {
  res.send('Welcome, Hope you are ready to tackle the problems')
})

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const userExists = USERS.some(user => user.email === email)

  if (userExists) {
    // if user already exists 
    // return 409 conflict status code
    res.status(409).send("User already exists")
  } else {
    USERS.push({ email, password });
  }
  // return back 200 status code to the client
  res.sendStatus(200)
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const userExists = USERS.find(user => user.email === email)

  if (!userExists) {
    
    res.status(401).send("User with provided email doesnot exists");
  } 
  else if (userExists.password !== password) {
     // If the password is not the same, return back 401 status code to the client
    res.status(401).send("Wrong Password")
  } 
  else {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = Math.random().toString(34).substr(2)
    res.status(200).json({ token })
  }



  // If the password is not the same, return back 401 status code to the client
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem

  res.send("Hello World from route 4!")
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const {problem, solution} = req.body

  const isAccepted = Math.random < 0.5

  SUBMISSION.push({problem, solution, isAccepted})

  if (isAccepted){
    res.status(200).send("Submission Accepted")
  }else{
    res.status(403).send("Submission Rejected")
  }

  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/questions", (req, res)){
  const {email, password} = req.body;

  const isAdmin = USERS.some(user => user.email == email )
  
  if(!isAdmin){
    return res.status(401).send("User not authorized")
  }

  const question = {
    id: QUESTIONS.length + 1,
    title,
    description,
    testCases
  }
  QUESTIONS.push(question)
  res.status(201).json(question)
}

app.listen(port, function () {
  console.log(`app listening on the port-  ${port}`)
})