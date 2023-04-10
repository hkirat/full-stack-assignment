const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const app = express()
const port = 3001
app.use(express.json())


//models
class User {
  constructor(email, password, isAdmin) {
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

class Question {
  constructor(title, description, testCases) {
    this.title = title;
    this.description = description;
    this.testCases = testCases;
  }
}

class Submission {
  constructor(solution, status) {
    this.solution = solution;
    this.status = status;
  }
}


//object stores
const USERS = [];



const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

];


//api

app.post('/signup', async (req, res) => {
  try {
    const { email, password, isAdmin = false } = req.body || {};

    // Check whether the body has email and password 
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user with this email already exists
    const existingUser =  await USERS.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // passward should be encrypted before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user object and save to database
    const newUser = new User( email,hashedPassword ,isAdmin );
    USERS.push(newUser);

    // Return success response
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  // Check if email and password are present in request body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user =  await USERS.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email,isAdmin:user.isAdmin }, "mysecretkey");

    // Set token in cookie
    res.cookie('jwt', token, { httpOnly: true });

    // Return success response
    return res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    // Handle any errors
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/questions', function(req, res) {

  //send the list uestions stored in object store
  res.status(200).send(QUESTIONS);

})

app.get("/submissions", function(req, res) {
  // get the question id and return its respective submission
  const { questionId } = req.body;

  if (!questionId) return res.status(401).send("Please Provide a questionID");

  res.json(SUBMISSION[questionId]);
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { questionId, solution } = req.body;
  const accepted = Math.round(Math.random());


  if (!(questionId in SUBMISSION)) SUBMISSION[questionId] = [];

  if (accepted) {
    SUBMISSION[questionId].push(new Submission(solution, "Accepted"));
    return res.send("CORRECT ANSWER");
  } else {
    SUBMISSION[questionId].push(new Submission(solution, "Rejected"));
    return res.send("WRONG ANSWER");
  }
});
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/addProblem", function (req, res) {
  const { email, title, description, testCases } = req.body;

  for (let i = 0; i < USERS.length; i++) {
    const user = USERS[i];

    if (user.email === email) {
      if (!user.isAdmin)
        return res.status(403).send("Only Admins Can Add Problems");

      const newQuestion = new Question(title, description, testCases);
      QUESTIONS.push(newQuestion);
      return res.status(200).send("Successfully Added the Problem");
    }
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})