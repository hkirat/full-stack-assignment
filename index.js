const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3001;

// Secret key for JWT validation
const secretKey = 'pratyushraj';

// Middleware
app.use(express.json());

const auth = (req, res, next) => {
  // Get the token from the request headers, query parameters, or cookies
  const token = req.headers.authorization; // Example: Bearer <token>
  // Extract the token from the "Authorization" header

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const formattedToken = token.replace('Bearer ', '');

  // Verify and decode the token
  jwt.verify(formattedToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Token is valid, extract the email from the decoded payload
    const email = decoded.user.email;
    const type = decoded.user.type;
    // Attach the email to the request object for future use
    req.email = email;
    req.userType = type;

    next();
  });
};

let USERS = [];

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


const validateEmailFormat = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


app.post('/signup', function (req, res) {
  try {
    const { email, password,type} = req.body;

    if(!email || !password) {
      return res.status(400).json({message:"Required parameters are missing or empty"});
    }

    if (!validateEmailFormat(email)) {
      return res.status(400).json({message:"Invalid email format"});
    }

    if (USERS.find(user => user.email === email)) {
      return res.status(400).json({message:"User already exists"});
    }


    const newUser = {
      email: email,
      password: password,
      type: type
    };

    USERS.push(newUser);
    
    return res.status(200).json({ message:'Sign up successful',User:newUser });

  } catch (err) {
    return res.status(404).send(err.message);
  }
})

app.post('/login', function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email ||!password) {
      return res.status(400).json({message:"Required parameters are missing or empty"});
    }
    if (!validateEmailFormat(email)) {
      return res.status(400).json({message:"Invalid email format"});
    }

    const user = USERS.find(user => user.email === email);

    if (!user) {
      return res.status(404).json({message:"User not found"});
    }
    if (user.password!== password) {
      return res.status(400).json({message:"Invalid password"});
    }

    const token = jwt.sign({user},secretKey);

    return res.status(200).json({ message:'Login successful',User:email,Token:token });
  }catch (err) {
    return res.status(404).send(err.message);
  }
})

app.get('/questions',auth, function (req, res) {

  //return the user all the questions in the QUESTIONS array
 return res.status(200).json({ message:'Question Get Successful',Questions:QUESTIONS});
})

app.get("/submissions",auth, function (req, res) {
  try{
    const user = req.email;

    const Submissions = SUBMISSION.find(submission=>submission.user === user);

    return res.status(200).json({user: user, submissions: Submissions});
  }catch(err){
    return res.status(404).send(err.message);
  }
});


app.post("/submissions",auth, function (req, res) {
  try{
    const user = req.email;
    const {questionTitle,solution} = req.body;

    if(!questionTitle ||!solution) {
      return res.status(400).json({message:"Required parameters are missing or empty"});
    }

    const isQuestion = QUESTIONS.find(question=> question.title == questionTitle);

    if(!isQuestion){
      return res.status(404).json({message:"Question not found"});
    }

    const newSubmission = {
      problem: questionTitle,
      solution: solution,
      user: user
    }

    SUBMISSION.push(newSubmission);
    
    return res.status(200).json({ message:'Submission successful',Submission:newSubmission });
  }catch(err){
    return res.status(404).send(err.message);
  }
});

// leaving as hard todos

app.post("/questions",auth, function (req, res) {
  try{
    const email = req.email;
    const userType = req.userType;
    
    if(userType !== 'admin'){
      return res.status(403).json({message:"You are not authorized to perform this action"});
    }

    const question = req.body;

    if(!question.title ||!question.description) {
      return res.status(400).json({message:"Required parameters are missing or empty"});
    }

    QUESTIONS.push(question);

    return res.status(200).json({Questions:QUESTIONS})
  }catch(err){
    return res.status(404).send(err.message);
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})