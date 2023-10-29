const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3001
app.use(express.urlencoded({extended:false}))
app.use(express.json())

const secretKey = 'mySecretKey';
const USERS =[
  { email: 'admin@beetcode.com' ,password:'passwordAdmin'},
  { email: 'user1@gmail.com' ,password:'1234567'}
];


const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [ ]

const authenticateUser = (req, res, next) => {
  
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
      try {
          const decoded = jwt.verify(token, secretKey);
          req.email = decoded.email;
          next();
      } catch (e) {
          res.status(401).json({ error: "invalid token" });
      }
  } else {
      res.status(401).json({ error: "Missing token" });
  }
}



app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;
  const existingUser = USERS.find(user=>user.email === email)

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(existingUser){
    return res.status(409).send(`Mail ID : ${email} already exists`)
  }else{
    // const randomNumber = Math.floor(1000 + Math.random() * 9000);
    // const token = email + randomNumber;
    const newUser = {
      email,password,role:'user'
    };

    USERS.push(newUser);
    //console.log(newUser);
    return res.status(200).send('New account create')
  }
})


app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email,password} = req.body;

  // Check if the user with the given email exists in the USERS array
  const existingUser = USERS.find(user=>user.email === email)
  
  if(!existingUser){
    return res.status(404).send(`Mail ID : ${email} not exists`)
  }else{
    
    // Also ensure that the password is the same
    const passwordChack = USERS.find(user=>user.email === email && user.password === password);
    
    if(passwordChack){

      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const token = jwt.sign({ email: email }, secretKey,{ algorithm: 'HS256' });
      return res.status(200).json({message:'Login Successful',token:token})

    }else{
      
      // If the password is not the same, return back 401 status code to the client
      return res.status(401).json({message:'Incorrect Password '})
    
    }
  }
})


app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})


app.post("/submissions",authenticateUser,function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const name = req.email.split('@')[0];
  const {userSolution} = req.body;

  if (userSolution.length > 0) {
   const newSolution = {name,userSolution};
   // Store the submission in the SUBMISSION array above
   SUBMISSION.push(newSolution)
   return res.status(200).json({ name,userSolution });
  } else {
      return res.status(400).json({ error: "No submissons for this answer" });
  }

});


app.get("/submissions", function(req, res) {
  // return the users submissions for this problem
 res.json(SUBMISSION)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addQuestions",authenticateUser,function(req,res){
  const domain = req.email.split('@')[1];
  const title = req.body.title;
  const description = req.body.description;
  const testCases = req.body.testCases;

  const newQuestion = {title,description,testCases};
  const isAdmin = domain === "beetcode.com";

  if(isAdmin){
    const isExisting = QUESTIONS.find(problem => problem.title === title);

    if(isExisting){
      return res.status(400).json({message:"problem already exists"});
    }

    QUESTIONS.push(newQuestion);
    return res.status(200).json({message:'problem added successfully'})
  }else{
    return res.status(401).json({message:"Unauthorized access"})
  }

})



app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})