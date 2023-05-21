const express = require('express')
const app = express()
const port = 3001
const path = require('path');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs'); 


const jwt = require('jsonwebtoken');
const USERS = [ {
    email:"admin@myapp.com",
    password:"admin1213",
    role:'admin'
}
];
const secretKey = 'MY_TOKEN_SIGNING_KEY'; 
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Sum of array",
    description: "Given an array , return it's sum",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "15"
    }]
  },
];


const SUBMISSION = [

]   //{email: ,problem_name="",result:pass/fail}
app.get('/signup',(req,res)=>{
  res.sendFile('signup.html', { root: './public' });
})
app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  console.log(req.body);
  const { email, password } = req.body;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const userExists = USERS.some(user => user.email === email)
  if (!userExists){
    USERS.push({'email':email,'password':password ,role:'user'});
  }
  else{
    console.log(`The user email '${email}' exists in the users array.`);
  }
  // return back 200 status code to the client
  res.status(200).send('OK');
})


app.get('/login',(req,res)=>{
  res.sendFile('login.html', { root: './public' });
})


app.post('/login', function(req, res) {
  // Add logic to decode body
  const { email, password} = req.body;
  // body should have email and password : this is ensured at front end 

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(user => user.email === email)
  console.log(user)
  console.log(password)
  if (user){
      if (user.password === password) {
      console.log(password)
      // If the password is the same, return back 200 status code to the client
      // Also send back a token (any random string will do for now)
      const payload = { email: email , role:user.role}; //TODO:Add role:admin,user
      const options = { expiresIn: '1h' }; 

      const token = jwt.sign(payload, secretKey, options);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      });
      res.status(200).json({ token });
    } else {
      // If the password is not the same, return back 401 status code to the client
      res.status(401).send('Incorrect password');
    } 
  }
  else{
     res.status(404).send('User not found');
  }
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  console.log("Request cookie: "+req.cookies.jwt);
  const token = req.cookies.jwt;
  console.log(token + "secret" + secretKey)
  if (!token) {
    // User is not logged in, send login.html
    console.log("Token does not exist")
    return res.sendFile('login.html', { root: './public' });
  }
  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Extract the email from the decoded JW
    console.log("questions requested by user"+ email)
    res.render('questions', { QUESTIONS }); // Render the 'questions' template and pass the QUESTIONS data

  } catch (err) {
    // Invalid token, send login.html
    console.log("Invalid Token");
    return res.sendFile('login.html', { root: './public' });
  } 
  
})

app.get("/submissions", function(req, res) {
  const token = req.cookies.jwt;
  console.log(token + "secret" + secretKey)
  if (!token) {
    // User is not logged in, send login.html
    console.log("Token does not exist")
    return res.sendFile('login.html', { root: './public' });
  }
    // Verify and decode the JWT
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Extract the email from the decoded JW
    const submissions = SUBMISSION.filter(submission => submission.email === email);
    return res.json(submissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   //check if user is logged in using jwt , if not logged in send login.html else , extract problem_name from req , email from jwt , store result in SUBMISSIONS array
  const token = req.cookies.jwt;
  if (!token) {
    // User is not logged in, send login.html
    console.log("Token does not exist")
    return res.sendFile('login.html', { root: './public' });
  }
  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Extract the email from the decoded JW
    const problemName = req.body.title;
    const submissionResult = Math.random() < 0.5 ? 'pass' : 'fail';
    SUBMISSION.push({ 'email':email,'problemName': problemName, result: submissionResult });
 
    // Return a success response
    return res.status(200).json({ message: 'Submission successful' , result: submissionResult });

  } catch (err) {
    // Invalid token, send login.html
    console.log("Invalid Token "+err);
    return res.sendFile('login.html', { root: './public' });
  } 

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.get("/addProblem",function(req,res){
  const token = req.cookies.jwt;
  if (!token) {
    // User is not logged in, send login.html
    console.log("Token does not exist")
    return res.sendFile('login.html', { root: './public' });
  }
    const decoded = jwt.verify(token, secretKey);
    const role= decoded.role;
    if (role === 'admin'){
      res.sendFile('addProblem.html', { root: './public' });
    }
    else{
      return res.status(403).send("Only admins can add questions")
    }

})
app.post('/addProblem', function(req, res) {
  // Extract the fields from the form data
  const title = req.body.title;
  const description = req.body.description;
  const testCases = JSON.parse(req.body.testCases); // Assuming testCases are provided in JSON format

  // Create a new problem object
  const newProblem = {
    title: title,
    description: description,
    testCases: testCases
  };

  // Store the new problem in the QUESTIONS array
  QUESTIONS.push(newProblem);

  // Return a success response
  res.status(200).json({ message: 'Problem added successfully' });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})