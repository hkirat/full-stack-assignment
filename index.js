const express = require('express')
const app = express()
const port = 3001

const USERS = [
  {
    "email": "alice@example.com",
    "password": "alice123"
  },
  {
    "email": "bob@example.com",
    "password": "bob456"
  },
  {
    "email": "charlie@example.com",
    "password": "charlie789"
  }
];

const QUESTIONS = [
  {
    "id": 1,
    "title": "Two states",
    "description": "Given an array, return the maximum of the array?",
    "testCases": [
      {
        "input": "[1,2,3,4,5]",
        "output": "5"
      }
    ]
  },
  {
    "id": 2,
    "title": "Sum of Array",
    "description": "Given an array of numbers, return the sum of all elements.",
    "testCases": [
      {
        "input": "[1,2,3]",
        "output": "6"
      },
      {
        "input": "[10,20,30]",
        "output": "60"
      }
    ]
  },
  {
    "id": 3,
    "title": "Find Minimum",
    "description": "Given an array, return the minimum value in the array.",
    "testCases": [
      {
        "input": "[4,2,7,1,9]",
        "output": "1"
      }
    ]
  },
  {
    "id": 4,
    "title": "Count Vowels",
    "description": "Given a string, return the number of vowels in the string.",
    "testCases": [
      {
        "input": "\"hello\"",
        "output": "2"
      },
      {
        "input": "\"world\"",
        "output": "1"
      }
    ]
  },
  {
    "id": 5,
    "title": "Is Even",
    "description": "Given a number, return true if it is even, otherwise false.",
    "testCases": [
      {
        "input": "4",
        "output": "true"
      },
      {
        "input": "7",
        "output": "false"
      }
    ]
  },
  ];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let email = req.email;
  let password = req.password;

  if(!email || !password){
    return res.status(400).send('Email and password are required');
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    // If the user with the given email already exists, return back 400 status code to the client
    if(USERS.find(user => user.email === email)) {
      return res.status(400).send('User already exists');
    }
    else{
        USERS.push({emil, password});  
    }

  // return back 200 status code to the client
  return res.status(200).send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  let email = req.email;
  let password = req.password;
  if(!email || !password){
    return res.status(400).send('Email and password are required');
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if(USERS.find(user => user.email === email && user.password === password)) {
      return res.status(200).json({
        token : 'randomString12345',
        message: 'Login successful'
      });
    }


  // If the password is not the same, return back 401 status code to the client
  else {
      return res.status(401).send('Invalid email or password');
  }


//   res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  return res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.



app.get("/", function(req, res){
  // res.send("Hello World from route 1!")
  res.send(`
    <html>
    <body>
    <h1 style="color:red">I AM PRALLAV</h1>
    </body>
    </html>`)
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})