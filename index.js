const express = require('express')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const app = express()
const port = 3001;
app.use(express.json());


const users = [];//array to store user information

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

app.post('/signup', async function(req, res) {
  
  // Add logic to decode body
  // body should have email and password
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  try{

    const{username, email,password}= req.body;
    //check if user already exists

    const existingUser = users.find(user=>
      user.email === email)
      if(existingUser){
        return res.status(400).json({message:'user already exists'});
      }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = {username, email, hashedPassword};

    users.push(newUser);

    return res.status(201).json({message:'User registered successfully'});
  }
  catch(err){
    //Logging the error
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  // return back 200 status code to the client
})

app.post('/login',async function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  try{
    const{email,password} = req.body;
    const user = users.find(user=>user.email===email)

    if(!user){
      return res.status(401).json({message:'Inavlid email or password'})
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //Generate a JWT token

    const token  = jwt.sign({userId: user.email},'4234234gsdffgsdd234234',{expiresIn:"3d"});
    return res.status(200).json({token});
  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:"Internal server error"})
  }

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.json(SUBMISSION)
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})