const express = require('express')
const app = express()
const port = 3001
app.use(express.json());

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

app.post('/signup', function (req, res)
{
  const { email, password } = req.body;

  if (!email || !password)
    {
      return res.status(400).send('Email and password are required.');
    }

  const userExists = USERS.some(user => user.email === email);
  if (userExists)
    {
      return res.status(400).send('User already exists.');
    }

  USERS.push({ email, password });

  res.status(200).send('User signed up successfully!');
});


app.post('/login', function(req, res)
{
  const { email, password } = req.body;

  if (!email || !password)
    {
      return res.status(400).send('Email and password are required.');
    }

  // Find the user
  const user = USERS.find(user => user.email === email);
  if (!user)
    {
      return res.status(400).send('User doesnt exist.');
    }

  // Check if password matches
  if (user.password !== password)
    {
      return res.status(401).send('Password doesnt match.');
    }

  // Generate a token (simple random string for now)
  const token = Math.random().toString(36).substring(2);

  res.status(200).json({ message: 'Login successful', token });
})


app.get('/questions', function (req, res)
{
  if (QUESTIONS.length === 0)
    {
      return res.status(404).send('No questions available.');
    }

  res.status(200).json(QUESTIONS);
});


app.get("/submissions", function (req, res)
{
  const { userId, problemId } = req.query;
  if (!userId || !problemId)
    {
      return res.status(400).send("User ID and problem ID are required.");
    }

  // Filter submissions for the given userId and problemId
  const userSubmissions = SUBMISSION.filter(
      submission => submission.userId === userId && submission.problemId === problemId
  );

  if (userSubmissions.length === 0)
    {
      return res.status(404).send("No submissions found for the given user and problem.");
    }

  res.status(200).json(userSubmissions);
});


app.post("/submissions", function (req, res)
{
  const { userId, problemId, submission } = req.body;
  if (!userId || !problemId || !submission)
    {
      return res.status(400).send("User ID, problem ID, and submission are required.");
    }

  const status = Math.random() > 0.5 ? "Accepted" : "Rejected";
  SUBMISSION.push({ userId, problemId, submission, status });

  res.status(200).json({ message: "Submission received.", status });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function()
{
  console.log(`Example app listening on port ${port}`);
});