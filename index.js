const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express()
const port = 3001

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

let USERS = [];

if (fs.existsSync('USERS.json')) {
  try {
    const data = fs.readFileSync('USERS.json', 'utf8');
    USERS = JSON.parse(data);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    USERS = [];
  }
}





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

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  const { username, password } = req.body;
  const newUser = { username, password };
    
    
    if (!USERS.some(user => user.username === username)) {
      USERS.push(newUser);
    
      fs.writeFileSync('USERS.json', JSON.stringify(USERS, null, 2));
      res.status(200).send('User signed up successfully');
  } else {
    res.status(400).send('User already exists');
  }
})

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', function(req, res) {
  const {username,password} =req.body;
  const newuser = {username,password}

  if (!USERS.some(user => user.username === username)) {
    res.status(401).send('User does not exists');
} else {
    if(USERS.some(user=> user.username === username) && USERS.some(user=> user.password === password) ){
      res.status(200).send('Successfull login');
    }else{
      res.status(401).send('Username and password does not match');
    }
  
}
  
  
})

app.get('/questions', function(req, res) {
  res.json(QUESTIONS)

  //return the user all the questions in the QUESTIONS array
  
})

app.get("/submissions", function(req, res) {
  res.json(SUBMISSION)
   // return the users submissions for this problem
  
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})