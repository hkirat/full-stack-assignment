import express from "express"
const app = express()
const port = 3001

app.use(express.json()); // Add middleware to parse incoming JSON data

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

app.post('/signup', function(req, res) {
  const {email, password} = req.body;

  // Check if user with given email already exists in USERS array
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    // If user already exists, return 409 (Conflict) status code
    return res.status(409).send('User already exists');
  }
  // If user does not already exist, add new user to USERS array
  USERS.push({ email, password });
  // return back 200 status code to the client
  res.status(200).send('User created successfully');

})

app.post('/login', function(req, res) {
  const {email, password} = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find( user => user.email === email);
  if(!user){
    // If user does not exist, return 401 (Unauthorized) status code
    return res.status(401).send('Invalid email or password');
  }
  // Check if the password is the same
  if (user.password === password) {
    // If password is correct, generate a token (for now, a random string will do)
    const token = Math.random().toString(36).slice(2);

    // Send back token to client with a 200 status code
    return res.status(200).json({ token });
  }

  // If password is incorrect, return 401 (Unauthorized) status code
  return res.status(401).send('Invalid email or password');
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("You can get all the question through this route.")
})

/*
In the implementation I provided for the POST /submissions route, the value of isAccepted is randomly determined by generating a random number between 0 and 1 using Math.random() and checking if it is less than 0.5. If the random number is less than 0.5, isAccepted is set to false. If the random number is greater than or equal to 0.5, isAccepted is set to true.

So, isAccepted has a 50% chance of being true and a 50% chance of being false. This is just an example implementation, and in a real application, the logic for accepting or rejecting a submission might be more complex and based on other factors such as the quality of the solution or the correctness of the code.
*/
app.post('/submissions', function(req, res) {
  // Get the submission details from the request body
  const { userId, problemId, solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Create a new submission object with the user's ID, problem ID, solution, and acceptance status
  const submission = {
    id: SUBMISSIONS.length + 1,
    userId: userId,
    problemId: problemId,
    solution: solution,
    isAccepted: isAccepted
  };

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Send a response to the client with the submission ID and acceptance status
  res.status(200).json({
    submissionId: submission.id,
    isAccepted: submission.isAccepted
  });
});

// Create a new problem (only accessible to admins)
app.post('/problems', function(req, res) {
  const {title, description} = req.body;

  // Check if the user is an admin
  const isAdmin = req.headers.authorization === 'Bearer admin_token';

  if (!isAdmin) {
    // If user is not an admin, return 401 (Unauthorized) status code
    return res.status(401).json({ error: 'You do not have permission to access this resource' });
  }

  // Create the new problem object and add it to the array of problems
  const newProblem = {
    id: PROBLEMS.length + 1,
    title,
    description
  };
  PROBLEMS.push(newProblem);

  // Send back the new problem object with a 200 status code
  return res.status(200).json(newProblem);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
})