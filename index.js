const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const USERS = [];

const QUESTIONS = [
  { 
    id: 1,
    title: "Maximum element",
    description: "Given an array , return the maximum element of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  id: 2,
  title: "Minimum element",
  description: "Given an array , return the minimum element of the array?",
  testCases: [{
        input: "[1,2,3,4,5]",
        output: "1"
    }]
}
];


const SUBMISSION = [

]

let isUserLoggedIn = false;
// for login

app.post('/signup', function(req, res) {
  // Add logic to decode body
  const {email, password, userType} = req.body

  if(email && password) {
    
    const existingUser = USERS.find(user => user.email === email);

    if(existingUser){

      res.status(401).send('User with that email already exists')
      return;
    }

    USERS.push({email, password, isAdmin: userType === 'admin'});
  }
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client

  res.status(201).send('Registered successfully!')

  console.log(USERS)

})

app.post('/login', function(req, res) {
  // Add logic to decode body
  const {email, password} = req.body

  if(email && password) {

    const existingUser = USERS.find(user => user.email === email && user.password === password);
    if(existingUser){
      isUserLoggedIn = true
      const token = generateRandomString(15)
      res.status(200).json({"message":'Login successful', isAdmin: existingUser.isAdmin, token})
      return;
    }
  }
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  res.status(401).send('Invalid credentials')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS)
  return;
})

app.get("/submission", function(req, res) {
  

  if(isUserLoggedIn){

    res.status(200).json(SUBMISSION)
  }

   // return the users submissions for this problem

  res.status(401).json({message: "Something went wrong!"})
  
});


app.post("/submit", function(req, res) {

  const { id, answer} = req.body

  if(isUserLoggedIn){

    const findQuestion = QUESTIONS.find(question => question.id === id)

    if(findQuestion){

      SUBMISSION.push({id, answer})
      res.status(200).json({message: 'Submitted successfully!', answer})
      return;
    }
  }
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/add-question", function(req, res) {

  const { title, description, testCases, userType} = req.body

  console.log(userType)

  if(isUserLoggedIn && userType === 'admin'){

    QUESTIONS.push({id, title, description, testCases})
    res.status(200).json({message: 'Question added successfully!'})
    return;
  }


  res.status(401).json({message: "Something went wrong!"})
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})