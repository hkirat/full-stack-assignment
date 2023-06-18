const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

var userIndex = 0;

const USERS = [];
const SUBMISSION = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];



app.get('/', function(req, res) {
  res.send(USERS)
});


app.post('/signup', function(req, res) {
  const user = {userIndex:userIndex, email:req.body.email, password:req.body.password};

  if (user.userIndex != -1){
    USERS.push(user);
    userIndex++;
    res.send('User created!')
    res.status(200);
  }
  else{
    res.send('User already exists!')
    res.send(401);
  }
})


// app.post('/login', function(req, res) {
//   // Add logic to decode body
//   // body should have email and password

//   // Check if the user with the given email exists in the USERS array
//   // Also ensure that the password is the same


//   // If the password is the same, return back 200 status code to the client
//   // Also send back a token (any random string will do for now)
//   // If the password is not the same, return back 401 status code to the client


//   res.send('Hello World from route 2!')
// })

// app.get('/questions', function(req, res) {

//   //return the user all the questions in the QUESTIONS array
//   res.send("Hello World from route 3!")
// })

// app.get("/submissions", function(req, res) {
//    // return the users submissions for this problem
//   res.send("Hello World from route 4!")
// });


// app.post("/submissions", function(req, res) {
//    // let the user submit a problem, randomly accept or reject the solution
//    // Store the submission in the SUBMISSION array above
//   res.send("Hello World from route 4!")
// });

// // leaving as hard todos
// // Create a route that lets an admin add a new problem
// // ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`)
})