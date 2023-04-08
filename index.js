const express = require('express')
const app = express()
const port = 3001
app.use(express.json())

const USERS = [{ email: "example.email@info.com", password: "psd123" }];

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
// middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

app.post('/signup', function (req, res) {

  // Add logic to decode body

  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password is not found!");
  }

  const userWithEmail = USERS.find(user => user.email === email);
  if (userWithEmail) {
    return res.status(409).send("User with this email already exists");
  }


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)

  USERS.push({ email, password });
  // return back 200 status code to the client
  res.status(200).send("User created successfully!")

})

app.post('/login', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and Password is not found!");
  }


  // Check if the user with the given email exists in the USERS array
  const userWithEmailandpassword = USERS.find(user => user.email === email && user.password === password);
  if (!userWithEmailandpassword) {
    return res.status(409).send("Wrong credentials try again");
  }

  // Generating the auth token
  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const authtoken = generateRandomString(10);
  res.status(200).json({ authtoken })

})

app.get('/questions', function (req, res) {

  res.status(200).json({ QUESTIONS })
})

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).json(SUBMISSION);
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above

  const { userid, problemid, code } = req.body;
  if (!userid || !problemid || !code) {
    return res.status(400).send("You have to enter userid problemid and code")
  }
  const newSubmission = { id: SUBMISSION.length + 10, userid, problemid, code };
  SUBMISSION.push({ newSubmission });
  res.status(200).json(newSubmission)
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

// route to add problem
app.post('/problems', isAdmin, (req, res) => {
  // code to add problem here
  const { title, description, testCases } = req.body;

  const new_Problem = { id: QUESTIONS.length + 1, title, description, testCases };
  QUESTIONS.push(new_Problem);
  res.json({ message: 'Problem added successfully' });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})








