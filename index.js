const express = require('express')
const app = express()
const port = 3000
app.use(express.json())


const USERS = [{
  email:"Robocop@gmail.com",
  password:"1234"}
];
const ADMIN = [{
  email:"admin@123",
  password:"1234"}
]
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = ["hello"]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email:useremail, password:userpassword } = req.body;
  const Userexists = USERS.some(user => user.email === email);
  if (Userexists) {
    return res.status(400).send("User with the same email already exists.");
  }

  USERS.push({ email, password });
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  res.status(200).send("User is signed up successfully");

  // return back 200 status code to the client
  // res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const{ email,password }=req.body;
  
  
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const userfound = USERS.some(user => user.email === email);
  if(!userfound){
    return res.status(400).send("User with the given email doesnt exist. Sign up maybe.?");
    
  }

  // If the password is the same, return back 200 status code to the client
  if(userfound && userfound.password===password){
    return res.status(200).send("Any random string");
  }
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if (userfound && userfound.password!==password){
    return res.status(401).send("Password is incorrect");
  }

  // res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {
  
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  // res.send("Hello World from route 3!")
  res.send(SUBMISSION);
});


app.post("/submissions", function(req, res) {
    const { submission } = req.body;
       // Store the submission in the SUBMISSION array above

    SUBMISSION.push(submission);
       // let the user submit a problem, randomly accept or reject the solution
    const a = Math.random(1, 2);
    if(a<0.5){
      return res.status(200).send("Accepted");
    }
    else{
      return res.status(200).send("Rejected");
    }
});

app.post("/adminsignup", function(req, res) {
  const {email, password} = req.body;
  const adminExists = ADMIN.some(admin => admin.email === email);
  if (adminExists) {
    return res.status(400).send("Admin with the same email already exists.");
  }

});

app.post("/admin/questions", function(req, res) {
  const { email,question } = req.body;
  const isAdmin = ADMIN.some(admin => admin.email === email);
  console.log(email);
  console.log(ADMIN);
  if (!isAdmin) {
    return res.status(401).send("You are not an admin");
  }
  QUESTIONS.push(question);
  return res.status(200).send("Question added successfully");
});
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
