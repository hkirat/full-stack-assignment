const { log } = require('console');
const express = require('express')
const app = express()
const port = 3001
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const USERS = [];

const QUESTIONS = [{
    title: "max of an array",
    description: 'Given an array , return the maximum of the array?',
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "min of an array",
    description: "Given an array , return the minimum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
  },
  {
    title: "sum of an array",
    description: "Given an array , return the sum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "15"
    }]
  },
  {
    title: "average of an array",
    description: "Given an array , return the average of the array?",
    testCases: [{

        input: "[1,2,3,4,5]",
        output: "3"
    }]
  },
  {
    title: "reverse an array",
    description: "Given an array , return the reverse of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "[5,4,3,2,1]"
    }]
  },
];


const SUBMISSION = [

]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.send("Hello World from route 1!");
})

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  const userExist = USERS.find(user => user.email === email);


  if (userExist) {
    res.status(400).send('User already exists!');
    console.log('User already exists!');
  } else {
    USERS.push({ email, password });
    res.status(200).send('User created successfully!');
    console.log('User created successfully!');
  }


  
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  
  
  // return back 200 status code to the client
  // res.send('Hello World!')
})

app.get('/users',(req, res)=>{
  res.json(USERS);
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  
  const user = USERS.find(user => user.email === email);
  if (user && user.password === password) {
    res.status(200).send('User logged in successfully!');
    console.log('User logged in successfully!');
  } else {
    res.status(401).send('Invalid credentials!');
    console.log('Invalid credentials!');
  }



  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
  console.log(QUESTIONS);
})

app.get("/submission", function(req, res) {
   // return the users submissions for this problem
  res.json(SUBMISSION);
  console.log(SUBMISSION);
});


app.post("/submission", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const { email, problemId, solution } = req.body;
   const status = Math.random() > 0.5 ? "Accepted" : "Rejected";
    SUBMISSION.push({ email, problemId, solution, status });
    res.status(200).send(`User submitted successfully! and the problem status is ${status}`);
   // Store the submission in the SUBMISSION array above
  // res.send("Hello World from route 4!")
});

// leaving as hard todos
app.post("/problems", function(req, res) { 
  const {isAdmin, title, description, input, output} = req.body;
  // const isAdmin = req.body.isAdmin;
  if(isAdmin === "yes"){
    QUESTIONS.push({title, description, testCases: [{input, output}]});
    res.status(200).send(`Problem added successfully!`);
  }else{
    res.status(401).send('You are not authorized to add a problem!');
  }
});

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})