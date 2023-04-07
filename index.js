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


// for testing purpose
const SUBMISSION = [
  {
    question: "Two states",
    submissions: [
      {
        user:"amith",
        code:"some code"
      }
    ],
  },
]

/* 

  TEST "/signup, /login" WITH CURL
  $ curl -d '{"email":"amith@gmail.com","password":"12345"}'   -H 'Content-Type:application/json'  http://localhost:3001/signup

*/

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const body = req.body

  // body should have email and password
  const isEmailAndPasswordPresent = 'email' in body && 'password' in body

  /*Store email and password (as is for now) in the USERS array
    above (only if the user with the given email doesnt exist) */
  if ( isEmailAndPasswordPresent ){
    const doesEmailExists = USERS.forEach(element => {
      if ( element.email == body.email ) return true
      else return false
    })
    if ( !doesEmailExists) USERS.push(body)
  }
  else res.send("invalid request")

  // return back 200 status code to the client
  res.status(200)
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const body = req.body

  // body should have email and password
  const isEmailAndPasswordPresent = 'email' in body && 'password' in body

  // Check if the user with the given email exists in the USERS array
   // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if( isEmailAndPasswordPresent ){
    
    USERS.forEach(element => {
      if ( element.email == body.email ){
        if ( element.password == body.password ) {
          res.status(200)
          res.send("random token")
        }
        else res.status(401) 
      }
    });

  }
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS)
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  // send questions as query parameter (.../submissions?question=two states)
  const question = req.query.question
  
  let submissions = []
  SUBMISSION.forEach(element => {
    if( element.question = question ){
      submissions.push(element.submissions)
    }
  });

  res.json(submissions)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

  function checkSubmission(){
    /* abstract code returns true or false accordingly */
    return true;
  }
  
  const userSubmission = req.body.userSubmission
  if( checkSubmission(userSubmission){
    SUBMISSION.push(userSubmission)
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
