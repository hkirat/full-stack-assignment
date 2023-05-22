const express = require('express')
const app = express()
const port = 3001

app.use(express.urlencoded({ extended: true })); 

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]
}];


const SUBMISSIONS = [

]

// KNow that while using HTML code in res.send wither use backticks `` or double quotes ""
app.get('/', (req, res) => {
  res.send(`
  <h1>User Registration</h1>
    <form method="POST" action="/signup">
      <input type="text" name="name" placeholder="Name" required /><br />
      <input type="email" name="email" placeholder="Email" required /><br />
      <button type="submit">Register</button>
    </form>
  `);
});

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  const name = req.body.name;
  const email = req.body.email;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const check_user_exists = USERS.find(USERS=> USERS.name === name || USERS.email === email);

  // return back 200 status code to the client
  if(check_user_exists)
  {
    res.send('User already exists Try to Login instead');
  }
  else{
    USERS.push({name,email});
    res.send('Signup Successfull. Status code is 200');
  }
  
});

app.get('/login', (req, res) => {
  res.send(`
  <h1>Login Here</h1>
    <form method="POST" action="/login">
      <input type="text" name="name" placeholder="Name" required /><br />
      <input type="email" name="email" placeholder="Email" required /><br />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  // Add logic to decode body
  // body should have email and password

  const name = req.body.name;
  const email = req.body.email;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  const check_user_exists = USERS.find(USERS=> USERS.name === name || USERS.email === email);

  // return back 200 status code to the client
  if(check_user_exists)
  {
    res.send('Login Successfull. Status code is 200');
  }
  else{
    USERS.push({name,email});
    res.send('Login Failed. Status code is 401');
  }
});


app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  // Return the user's submissions for this problem
  res.send(SUBMISSIONS);
});

app.get("/submissions/new", function(req, res) {
  // Display the submission form
  res.send(`
    <h1>Submit a Problem</h1>
    <form method="POST" action="/submissions">
      <input type="text" name="title" placeholder="Title" required /><br />
      <textarea name="description" placeholder="Problem Statement" required></textarea><br />
      <textarea name="solution" placeholder="Solution" required></textarea><br />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/submissions", function(req, res) {
  const title= req.body.title;
  const description = req.body.description;
  const solution = req.body.solution;
  const randomAccept = Math.random() < 0.5; // Randomly accept or reject the solution

  const submission = {
    title,
    description,
    solution,
    accepted: randomAccept,
  };

  SUBMISSIONS.push(submission); // Store the submission in the SUBMISSIONS array

  res.send("Submission received!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.


app.get('/questions/new',(req,res)=>{
  res.send(`
    <h1>Submit a Problem</h1>
    <form method="POST" action="/questions">
      <input type="text" name="title" placeholder="Title" required /><br />
      <textarea name="description" placeholder="Problem Statement" required></textarea><br />
      <textarea name="testcases" placeholder="Testcases" required></textarea><br />
      <button type="submit">Submit</button>
    </form>
  `);
})
app.post('/questions', (req, res) => {
  const title= req.body.title;
  const description = req.body.description;
  const testcases = req.body.testcases;

  // Create a new problem object
  const problem = {
    title,
    description,
    testcases
  };

  // Add the problem to the problems array
  if(title==="admin")
  {
    QUESTIONS.push(problem);

    res.send('Problem added successfully. Status Code 200');
  }
  else{
    res.send("Access denied. Only admins can add problems. Status Code 401");
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})