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


const SUBMISSION = [

]

app.post('/signup', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password, isAdmin} = req.body

  if (!email || !password) {
    res.status(400).json({ "message": "Please provide all values" })
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userEmail = USERS.find(item => item.email === email);

  if (userEmail) {
    res.status(401).send("Email already exists!")
  }
  else {
    let ele = { email, password, isAdmin }
    USERS.push(ele)
    // return back 200 status code to the client
    res.status(200).send('Sign Up successful')

  }


})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ "message": "Please provide all values" })
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userExists = USERS.find(user => user.email === email && user.password === password);

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  if (userExists) {
    res.status(200).json({"token":"IamIndian"})
  }
  else {
    res.status(401).send("Invalid credentials")

  }

})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.get("/submissions", function (req, res) {

  const {title} = req.query
  // return the users submissions for this problem
  const answers = SUBMISSION.filter(ques => ques.quesTitle === title)
  res.send(answers)
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const answer = req.body

  const randomNumber = Math.floor(Math.random() * 10) + 1;

  if(randomNumber % 2 === 0){
    SUBMISSION.push(answer)
    res.send("Success!");
  }
  else{
    res.send("submission failed!");
  }

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addQuestions", (req, res)=>{
  const {isAdmin} = req.query;
  const question = req.body;
  if(isAdmin === 1){
    QUESTIONS.push(question)
    res.status(200).send("Question added successfully")
  }
  else{
    res.status(401).send("Unauthorized access")
  }
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})