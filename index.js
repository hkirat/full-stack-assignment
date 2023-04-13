const express = require('express')
const bodyparser = require('body-parser')

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

const SUBMISSION = []

const tokens = []

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const {username, password, usertype} = req.body
  USERS.push({username, password, usertype})


  // return back 200 status code to the client
  res.status(200).send('ok')
  res.send('Hello World!')
})

app.get('/login',(req, res) => {
 const {username, password } = req.body;
 const user = users.find(user => user.username === username && user.password === password );
  if(user){
    res.send({
  token: '🎟️'
});
  }
  else{
    res.status(401).send('Invalid username and password');
}
});


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS)
})

app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
    const {token} = req.body
    if(tokens.includes(token))
    {
      const solution = req.body
    SUBMISSION.push(solution)
    res.status(200).send('ok')}
    else {
      res.status(401).send('Unauthorized')
    }
  });

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addquestions", function(req, res) {
    const {token, username} = req.body
    if(tokens.includes(token)){
      const user = USERS.find((user) => user.username === username)
      if(user.usertype === 'admin'){
        const question = req.body
        QUESTIONS.push(question)
        res.status(200).send('ok')
      }
      else {
        res.status(401).send('Unauthorized')
      }
    }
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
