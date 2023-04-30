const express = require('express')
const app = express()
const port = 3001

// The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. 
app.use(express.json());

const USERS = [
  {
    email: "admin@gmail.com",
    password: "12345",
    type: "admin"
  },
  {
    email: "user1@gmail.com",
    password: "11111",
    type: "user"
  },
  {
    email: "user2@gmail.com",
    password: "root",
    type: "user"
  },
];

const QUESTIONS = [{
    questonId: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [
  {
    questionId: 1,
    code: "<h1>test</h1>",
    email: "user1@gmail.com"
  }
]

app.post('/signup', function(req, res) {
  // body should have email and password
  if(req.body.email && req.body.password) {
    // Add logic to decode body
    const {email, password} = req.body;
    const isUserExist = USERS.find((user)=>user.email===email);
    if(!isUserExist) {
      USERS.push({email, password});
      res.status(200).send('Your account has been created successfully!');
    } else {
      res.status(200).send("User already exist.");
    }
  } else {
    res.status(200).send('Email and Password are required for signup.');
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  // 
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  if(req.body.email && req.body.password) {
    const {email, password} = req.body;
    const user = USERS.find((user)=>user.email===email);
    if(user) {
      if(user.password === password) {
        res.status(200).send({token:'xyzabc123'});
      } else {
        res.status(401).send('Please enter correct email and password.');
      }
    } else {
      res.status(404).send("Email and Password doesn't exist. Please signup.")
    }
    
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const {email, questionId} = req.body;
  const userSubmission = SUBMISSION.find((submission)=> submission.email === email && submission.questionId === questionId)

  res.status(200).send(userSubmission);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const {email, code, questionId} = req.body;
  SUBMISSION.push({questionId, code, email});
  res.status(200).send("Your submission has been successfully submitted for this problem.")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addProblem", function(req, res) {
  if(req.body.email && req.body.password) {
    const {email, problem} = req.body;
    const user = USERS.find((user)=>user.email===email);
    if(user.type === "admin") {
      QUESTIONS.push(problem)
      res.status(200).send("Your problem has been added successfully.")
    }
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})