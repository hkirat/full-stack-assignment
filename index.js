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
},
{
  id: 2,
  title: "Palindrome Check",
  description: "Write a function to check if a string is a palindrome.",
  testCases: [
    {
      input: "'racecar'",
      output: "true",
    },
    {
      input: "'hello'",
      output: "false",
    },
  ],
},
{
  id: 3,
  title: "Factorial",
  description:
    "Write a function to calculate the factorial of a given number.",
  testCases: [
    {
      input: "5",
      output: "120",
    },
    {
      input: "0",
      output: "1",
    },
  ],
},
{
  id: 4,
  title: "FizzBuzz",
  description:
    "Write a program that prints the numbers from 1 to 100. But for multiples of three, print 'Fizz' instead of the number and for the multiples of five, print 'Buzz'. For numbers which are multiples of both three and five, print 'FizzBuzz'.",
  testCases: [
    {
      input: "15",
      output: "'FizzBuzz'",
    },
    {
      input: "3",
      output: "'Fizz'",
    },
    {
      input: "5",
      output: "'Buzz'",
    },
    {
      input: "7",
      output: "7",
    },
  ],
},
{
  id: 5,
  title: "Reverse Array",
  description: "Write a function to reverse an array.",
  testCases: [
    {
      input: "[1,2,3,4,5]",
      output: "[5,4,3,2,1]",
    },
    {
      input: "['apple', 'banana', 'orange']",
      output: "['orange', 'banana', 'apple']",
    },
  ],
},
{
  id: 6,
  title: "Sum of Even Numbers",
  description:
    "Write a function to calculate the sum of all even numbers in an array.",
  testCases: [
    {
      input: "[1,2,3,4,5,6]",
      output: "12",
    },
    {
      input: "[2,4,6,8,10]",
      output: "30",
    },
  ]

}];


const SUBMISSION = [

]

app.use(express.json())


app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
 const {email,password} = req.body;
 // Check if user with the given email already exists , if not add the user
 const existingUser = USERS.find((user)=>user.email===email);
 if(!existingUser){ USERS.push({email,password}); res.sendStatus(200).send('user added successfully');}
 // User already exists, return an error response
 else {res.status(409).send('user already exists');} 
})

app.post('/login', function(req, res) {
 // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client, also add random token

  // this is also right but below one is more elaborative
  // const user = USERS.find((user)=>user.email===email && user.password===password);
  // if(user){const token =`${email}.randomToken123`;res.send(200).json({token});}
  // else{res.sendStatus(401).send('user email is incorrect or password is wrong')};

  const user = USERS.find(user => user.email === email);
  if (!user) {
    // User not found, return an error response
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if the password is the same
  if (user.password !== password) {
    // Password doesn't match, return an error response
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // If the password is the same, generate a token (random string for now)
  const token = generateToken();

  // Return success response with the token
  return res.status(200).json({ message: 'Login successful', token });
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.sendStatus(200).json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.sendStatus(200).json(SUBMISSION);
});


app.post("/submissions", function(req, res) {
    // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  const submissions = req.body();
  const accepted = Math.random()<0.5;
  submissions.accepted= accepted;
  SUBMISSION.push(submissions);
});

// leaving as hard todos
// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  const isAdminUser = req.headers.isAdmin; // Assuming isAdmin is passed in the request headers
  if (isAdminUser) {
    // User is an admin, continue to the next middleware
    next();
  } else {
    // User is not an admin, return an unauthorized error response
    res.status(401).json({ error: 'Unauthorized access' });
  }
}
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/problems', isAdmin, function(req, res) {
  // Add logic to create a new problem
  const problem = req.body; // Assuming the problem details are passed in the request body

  // Add the new problem to the PROBLEMS array or store it in the database

  // Return a response indicating the successful addition of the problem
  res.status(200).json({ message: 'Problem added successfully' });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})