const express = require("express");
const res = require("express/lib/response");
const app = express();
const port = 3001;
app.use(express.json())
const USERS = [];
const admin={
  email: 'admin@gmail.com',
  password: 'admin'
}
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const oldUser = USERS.find(items => items.email === email);
  if(oldUser){
   return res.status(200).send('User already exists')
  }
  else{
    USERS.push({email,password})
  return res.status(200).send('New user created');
  }
  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
   const { email, password} = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
     const userVerification = USERS.find(users => (users.email===email && users.password===password))
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  if(userVerification)
  {
    res.status(200).json({login:"success",token:"fodhfoihdfuieruiehdjhdiu"})
  }
  // If the password is not the same, return back 401 status code to the client
  else{
    res.status(401).json({login:"failure : user does not exists or wrong password"})
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  const {submission} = req.body;

});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
    const {submission}= req.body;
    const acceptance = Math.random()
    if(acceptance >=0.5)
    {
      SUBMISSION.push({submission});
      res.status(201).json({message:"solution accepted"})
    }
    else{
      res.status(401).json({message:"solution not accepted"})
    }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addquestions",(req,res)=>{
  const {email,password,question}=req.body;
  if(admin.email===email && admin.password===password)
  {
      QUESTIONS.push(question)
      res.status(200).json({message:"question added"})
  }
  else{
    res.status(400).json({error:"Only admin can add questions"})
  }
})
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
