const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const port = 3001;

app.use(express.json()); // Middleware to parse JSON request bodies

const USERS = [ 
{
    email: 'admin@admin.com',
    password: 'AdminHumai@ym007', //hardcoded data
    role: 'admin'
},
{
    email: 'user1@example.com',
    password: 'secret123',
    role: 'user'
  },
];

const QUESTIONS = [{
    id: "1",
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [

]

const JWT_SECRET = 'mybackend';

//middleware functions
const authenticateToken = function(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.redirect('/login');
    }
  
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.redirect('/login');
      }
  
      req.user = user;
      next();
    });
  }

const checkAdmin = function(req, res, next) {
    const user = req.user;
  
    if (user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    next();
  }

app.post('/signup', (req, res) => {
    const { email, password} = req.body;
     //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
    // Check if user with the same email already exists
    if (USERS.find(user => user.email === email)) {
      return res.status(409).send('User with this email already exists'); 
    }
  
    // Create a new user obj with roles of normal user and add it to the users array
    const newUser = {  email, password, role: 'user' };
    USERS.push(newUser);
  
    
    res.status(201).json(newUser);
  }); // return back 200 status code to the client


 

app.post('/login', function(req, res) { 
    const { email, password } = req.body;  // Add logic to decode body  // body should have email and password

    
    const user = USERS.find(user => user.email === email); //check if email exists
  
    if (!user || user.password !== password) { // Check if the password is same
      return res.status(401).send('Incorrect email or password'); // If the password is not the same, return back 401 status code to the client
    }
     
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET); // Also send back a token (JWT)
   
    res.status(200).json({ token });   // If the password is the same, return back 200 status code to the client

})

app.get('/questions', authenticateToken, function(req, res) {

    res.send(QUESTIONS);
    
})

app.get('/submissions', authenticateToken, function(req,res){

  const token = req.headers.token; 

  // token used to identify and filter out user's submission
  const userSub = SUBMISSION.filter(submisson => submisson.token === token);

  // return the users submissions for this problem
  res.json(userSub);

});



app.post("/admin", authenticateToken, checkAdmin, function (req, res) {
    
    const { title, description, testCases } = req.body;
    QUESTIONS.push({title, description, testCases});
    //allow admin user to create and post a question
    res.status(200).send('OK');
  

});

app.listen(port,function() {
  console.log(`Example app listening on port ${port}`)
})