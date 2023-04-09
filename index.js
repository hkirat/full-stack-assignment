const express = require('express')
const jwt = require("jsonwebtoken");
const app = express()
app.use(express.json());
const port = 3001

const USERS = [{
  "email": "abc@gmail.com",
  "password": "Abc@123",
  role: "ADMIN"
}];

const ROLES = {
  admin: "ADMIN",
  learner: "LEARNER"
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

// Middleware
const verifyJWToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({message: "Token not present"});
  }
  try {
    const decoded = jwt.verify(token, "RANDOM STRING");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({message: "Invalid Token"});
  }
  return next();
};

const verifyAdmin = (req, res, next) => {
  const requiredValues = ["email"];
  if (!checkBody(req.body, requiredValues)) {
    res.status(400).send({message: "Email id missing"})
  }
  const { email } = req.body;

  const { role } = USERS.find(user => user.email === email);
  if (role === ROLES.admin) {
    return next();
  }
  res.status(401).send({message: "You are unauthrized to perform this action"})
}


const checkBody = (body, requiredValues) => {
  return Object.keys(body).every(key => requiredValues.includes(key))
}

app.post('/signup', async (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const requiredValues = ["email", "password"];
  if (!checkBody(req.body, requiredValues)) {
    res.status(400).send({message: "Email id or password missing"})
  }
  const { email: reqUserEmail, password: reqUserPassword } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const oldUserExists = USERS.some(user => user.email === reqUserEmail);

  if (oldUserExists) {
    req.status(409).send({message: "user already exists"})
  }
  const token = jwt.sign({ email }, "RANDOM STRING", { expiresIn: "2h" });

  encryptedPassword = await bcrypt.hash(reqUserPassword, 10);

  USERS.push({email: reqUserEmail, password: encryptedPassword, role: ROLES.learner})
  // return back 200 status code to the client
  res.status(201).send({message: 'User Added', data: {email: reqUserEmail, password: encryptedPassword, token, role: ROLES.learner}})
})

app.post('/login', async(req, res) => {
  // Add logic to decode body
  // body should have email and password
  const requiredValues = ["email", "password"];
  if (!checkBody(req.body, requiredValues)) {
    res.status(400).send({message: "Email id or password missing"})
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const checkCredentials = USERS.some(user => user.email === reqUserEmail && user.password === reqUserPassword);

  if (!checkCredentials) {
    res.status(401).send({message: "Email or password incorrect"})
  }
  
  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  
  const token = jwt.sign({ email }, "RANDOM STRING", { expiresIn: "2h" });

  encryptedPassword = await bcrypt.hash(reqUserPassword, 10);

  res.status(200).send({token, message: "Logged in successfully"})
})

app.get('/questions',verifyJWToken, function(req, res) {

  // return the user all the questions in the QUESTIONS array
  res.status(200).send({questions: QUESTIONS, total_records: QUESTIONS.length})
})

app.get("/submissions", verifyJWToken, function(req, res) {
   // return the users submissions for this problem
   const requiredValues = ["questionId", "userEmail"];
  if (!checkBody(req.body, requiredValues)) {
    res.status(400).send({message: "Required values are missing"})
  }
  const {questionId, userEmail} = req.body
  return res.status(201).send({data: SUBMISSION.map(sub => (sub.questionId === questionId && sub.userEmail === userEmail) ? sub : null)})
});


app.post("/submissions", verifyJWToken, function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
   const requiredValues = ["questionId", "userEmail", "solution" ];
   if (!checkBody(req.body, requiredValues)) {
     res.status(400).send({message: "Required values are missing"})
  }
  
  const { questionId, userEmail, solution } = req.body;

  SUBMISSION.push({ questionId, userEmail, solution });
  res.status(200).send({message: "submission added successfully"})
});

// leaving as hard todos

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addQuestion", verifyJWToken, verifyAdmin, (req, res) => {
  const requiredValues = ["question"];
  if (!checkBody(req.body, requiredValues)) {
    res.status(400).send({message: "Email id missing"})
  }
  const { question } = req.body;
  QUESTIONS.push(question);
  res.status(200).send({message: "Question added successfully"})
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})