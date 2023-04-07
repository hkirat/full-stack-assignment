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
}];

app.use(express.json())      // this is a middleware that tells that we are going to use json (javascript object in the post requests)

const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  
  const {email , password , isAdmin} = req.body
  
  if(!email || !password || !isAdmin){
      return res.status(400).send("email and password are required");
  }

  const findUser = USERS.find(user =>
      user.email === email
  )
  
  // checking for validations 
  if(findUser){
      return res.status(400).send("User is already present in the databse")
  }
  
  // if everthing is okay
  USERS.push({email,password , isAdmin})
  return res.status(201).send({email,password,isAdmin});
  
})


// login functionality for user 
app.post('/login', function(req, res) {
  
  const {email , password} = req.body

  if(!email || !password){
      return res.status(400).send("email and password are required");
  }
  
  // checking if the user exists 
  const findUser = USERS.find(user =>
      user.email === email && user.password === password
  )

  if(findUser){
    if(findUser.isAdmin === "false"){                                    // if the user is not a admin
      const token = 'UserToken'
      return res.status(200).send({status:"sucess login", token:token})
    }else if(findUser.isAdmin === "true"){                               // if the user is a  admin 
      const token = "AdminToken";
      return res.status(200).send({status:"sucess login", token:token})
    }
  }else{
    res.status(401).send("No user found , unauthorised")
  }

})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  if(QUESTIONS.length){
    return res.status(200).send(QUESTIONS)
  }else{
    return res.status(404).send("No questions has been assigned yet");
  }
  
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  
   // returning sumissions made by users according to their email
   const { email  } = req.body;

   if(!email){
    return res.status(400).send("Please enter email of the user")
   }

   const findUser = USERS.find(user => user.email === email)
   
   // first checking if the user exist for the given mail
   if(findUser){
    const submission = SUBMISSION.filter(userSub => userSub.email === email )

    if(submission.length){
        return res.status(200).send(submission)
    }else{
        return res.status(200).send(`No Submissions made by ${email}`)
    }
   }else{
        return res.status(404).send("No user exists for this email please register")
   }
   
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above

   // according to my get submissions the objects inside the SUBMISSION array must contain users email , solution he has given 
   const submission = req.body;

   if(!submission.email && submission.solution?.trim() === ""){
      return res.status(400).send("Please Providr a valid email and solution")
   }

   // checking if the user exists 
   const findUser = USERS.find(user => user.email === submission.email)

   if(findUser){
      SUBMISSION.push(submission)
      return res.status(200).send({data:submission, status:"Accepted"})
   }else{
    return res.status(404).send("No user exists please register to make a solution")
   }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// creating a middleware for authenticating the admin token 
  const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];      // the 0 index will contain the bearer as i am sending the bearer token 
    if (token === 'AdminToken') {
      console.log("token verified")
      next();                          // passing to createQuestion
    } else {
      res.sendStatus(401),send("invalid token ");
    }
  };

// creating a post request for the admin to create a problem
app.post("/createQuestion" ,authMiddleware, (req,res)=> {
  const question = req.body;
  QUESTIONS.push(question);
  return res.status(200).send({status:"Created", question});
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})