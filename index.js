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
  const { email, password }= req.body;

  const userExists = USERS.some((user) => user.email === email);

  if (!userExists){
    USERS.push({email, password});
    userIndex++;
    res.send('User created!')
    res.status(200);
  }
  else{
    res.send('User already exists!')
    res.send(401);
  }
})


app.post('/login', function(req, res) {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email);

  if(user){
    if(user.password === password){
      res.status(200).send('User logged in!');
    }
    else{
      res.send("Password is incorrect!")
      res.status(401);
    }
  }
  else{
    res.send("User does not exist!")
    res.status(401);
  }
});

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