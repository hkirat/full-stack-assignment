const express = require('express')
const app = express()
const port = 3001

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const USERS = [];

const QUESTIONS = [
  {
    title: "Sum of Two Numbers",
    description: "Write a function to return the sum of two numbers.",
    testCases: [
      { input: "2, 3", output: "5" },
      { input: "-1, 1", output: "0" },
    ],
  },
  {
    title: "Reverse a String",
    description: "Write a function to reverse a string.",
    testCases: [{ input: "hello", output: "olleh" }],
  },
  {
    title: "Factorial of a Number",
    description: "Write a function to calculate the factorial of a number.",
    testCases: [
      { input: "0", output: "1" },
      { input: "5", output: "120" },
    ],
  },
  {
    title: "Is Prime Number",
    description: "Write a function to check if a number is prime.",
    testCases: [
      { input: "1", output: "false" },
      { input: "7", output: "true" },
    ],
  },
  {
    title: "Palindrome Check",
    description: "Write a function to check if a string is a palindrome.",
    testCases: [
      { input: "racecar", output: "true" },
      { input: "hello", output: "false" },
    ],
  },
  {
    title: "Fibonacci Sequence",
    description: "Write a function to generate the Fibonacci sequence up to n terms.",
    testCases: [
      { input: "5", output: "[0, 1, 1, 2, 3]" },
      { input: "8", output: "[0, 1, 1, 2, 3, 5, 8, 13]" },
    ],
  },
  {
    title: "Array Max Element",
    description: "Write a function to find the maximum element in an array.",
    testCases: [
      { input: "[2, 5, 1, 8, 10, 3]", output: "10" },
      { input: "[7, 4, 2, 9, 1]", output: "9" },
    ],
  },
  {
    title: "Count Vowels in a String",
    description: "Write a function to count the number of vowels in a string.",
    testCases: [
      { input: "hello", output: "2" },
      { input: "programming", output: "4" },
    ],
  },
  {
    title: "Array Intersection",
    description: "Write a function to find the intersection of two arrays.",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5], [3, 4, 5, 6, 7]",
        output: "[3, 4, 5]",
      },
      {
        input: "[10, 20, 30], [30, 40, 50]",
        output: "[30]",
      },
    ],
  },
  {
    title: "Calculate Area of a Circle",
    description: "Write a function to calculate the area of a circle given its radius.",
    testCases: [
      { input: "5", output: "78.54" },
      { input: "3", output: "28.27" },
    ],
  },
];



const SUBMISSION = [
  {
    userId: 1, // User ID associated with the submission
    questionId: 1, // Question ID for the problem being solved
    code: "function add(a, b) { return a + b; }", // The code submitted by the user
    result: "5", // The result or output of the code
    status: "accepted", // Submission status (accepted, rejected, or pending)
  },
  {
    userId: 2,
    questionId: 2,
    code: "function reverseString(str) { return str.split('').reverse().join(''); }",
    result: "olleh",
    status: "accepted",
  },
  {
    userId: 3,
    questionId: 3,
    code: "function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }",
    result: "120",
    status: "rejected",
  },
  {
    userId: 1,
    questionId: 4,
    code: "function isPrime(num) { /* implementation here */ }",
    result: "true",
    status: "pending",
  },
  {
    userId: 2,
    questionId: 5,
    code: "function isPalindrome(str) { /* implementation here */ }",
    result: "false",
    status: "accepted",
  },
];


// Add a route for user registration
app.post('/signup', function(req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Check if a user with the given email already exists
  const userExists = USERS.some(user => user.email === email);

  if (!userExists) {
    // If the user doesn't exist, add them to the USERS array
    USERS.push({ email, password });

    // Return a 200 status code to the client
    res.status(200).send('User registered successfully');
  } else {
    // Return a 409 status code to indicate conflict (user already exists)
    res.status(409).send('User already exists');
  }
});



// Add a route for user login
app.post('/login', function(req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (user && user.password === password) {
    // If the user exists and the password matches, return a 200 status code and a token
    const token = "randomToken"; // You should generate a secure token here
    res.status(200).json({ token });
  } else {
    // If the user doesn't exist or the password is incorrect, return a 401 status code
    res.status(401).send('Unauthorized');
  }
});



// Add a route to retrieve all questions
app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});




// Add a route to retrieve user submissions for a problem
app.get('/submissions', function(req, res) {
  // Return the user's submissions for this problem
  res.json(SUBMISSION);
});



app.post("/submissions", function (req, res) {
  // Simulate random acceptance or rejection of the submission
  const isAccepted = Math.random() < 0.5; // 50% chance of acceptance

  // Assuming the request body contains the necessary data
  const { userId, questionId, code } = req.body;

  if (userId && questionId && code) {
    const submission = {
      userId,
      questionId,
      code,
      result: isAccepted ? "Accepted" : "Rejected", // Simulated result
    };

    // Store the submission in the SUBMISSION array
    SUBMISSION.push(submission);

    // Return a response indicating whether the submission was accepted or rejected
    res.status(isAccepted ? 200 : 400).json({ message: isAccepted ? "Submission Accepted" : "Submission Rejected" });
  } else {
    // If the request body is missing required data, return an error response
    res.status(400).json({ error: "Incomplete submission data" });
  }
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post('/addProblem', function(req, res) {
  // Check if the user is an admin (implement proper admin authentication here)
  const isAdmin = true; // Replace with admin authentication logic

  if (isAdmin) {
    // Add logic to add a new problem to the QUESTIONS array
    // You can decode the problem details from the request body
    const { title, description, testCases } = req.body;
    const newProblem ={
      title, 
      description, 
      testCases
    }; 

    QUESTIONS.push(newProblem);
//console.log(QUESTIONS);
    res.status(200).send('Problem added successfully');
  } else {
    // Return a 403 status code if the user is not an admin (forbidden)
    res.status(403).send('Admin privileges required');
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})