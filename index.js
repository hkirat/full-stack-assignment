const express = require('express')
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';
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

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  }
  // body should have email and password
  const exists = USERS.some(user => user.email === email);

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!exists) {
    USERS.push({
      email,
      password,
      isAdmin: false
    })
    res.status(200).send("User created successfully");
  }
  else {
    res.status(400).send("User already exists");
  }
})

app.post('/login', function(req, res) {
  const { email, password } = req.body;
  // body should have email and password
  const user = USERS.find(user => user.email === email && user.password === password);


  const token = jwt.sign({ email:email }, secretKey,{ expiresIn: "1800s" });


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (user) {
    res.status(200).send({
      message: "Login successful",
      token: token,
      user
    });
  }
  else {
    res.status(401).send("Invalid credentials");
  }
})

app.get('/questions', function(req, res) {
  
  res.status(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   res.status(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   let isAccepted = Math.random() > 0.5;

   // Store the submission in the SUBMISSION array above
   SUBMISSION.push({
     ...req.body,
     isAccepted
   })
   res.status(200).json({
     message: isAccepted ? "Accepted" : "Rejected"
   });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/setAdmin", function (req, res) {
  const authHeader = req.headers["authorization"];
  //Extracting token from authorization header
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const { email } = jwt.verify(token, secretKey); //verify the token
    
    const user = USERS.find(user => user.email === email); // check if mail exists
    
    if (user) {
      user.isAdmin = true;
      res.status(200).json({
        message: "Admin set",
        user
      });
    } else {
      res.status(404).json({
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized"
    });
  }
})

app.post("/admin/questions", function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const { email } = jwt.verify(token, secretKey);

    const user = USERS.find(user => user.email === email);
    if (user.isAdmin) {
      const { problem } = req.body;
      QUESTIONS.push(problem);
      res.status(200).json({
        message: "Problem added successfully",
        questions: QUESTIONS  
      });
    } else {
      res.status(401).json({
        message: "Unauthorized . Only admins can add problems"
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})