const express = require("express");
const app = express();
const port = 3001;

// Array of user objects with id, name, email, password, and isAdmin properties
const USERS = [
  {
    id: "abc-0",
    name: "captain_sparkles",
    email: "john_doe@example.com",
    password: "secret",
    isAdmin: false
  },
  {
    id: "abc-1",
    name: "queen_of_the_universe",
    email: "jane_doe@example.com",
    password: "password123",
    isAdmin: true
  },
  {
    id: "abc-2",
    name: "the_dancing_dragon",
    email: "jim_smith@example.com",
    password: "qwerty",
    isAdmin: false
  },
  {
    id: "abc-3",
    name: "king_of_the_castle",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true
  }
];

// An array of 5 sample questions, each with a title, description, and test cases
const QUESTIONS = [
  {
    id: "xyz-0",
    title: "Reverse a string",
    description: "Write a function that reverses a string.",
    testCases: [{input: "'hello'", output: "'olleh'"}, {input: "'world'", output: "'dlrow'"}]
  },
  {
    id: "xyz-1",
    title: "Find the longest word",
    description: "Write a function that takes a sentence and returns the longest word.",
    testCases: [{input: "'The quick brown fox jumps over the lazy dog'", output: "'jumps'"}, {input: "'May the force be with you'", output: "'force'"}]
  },
  {
    id: "xyz-2",
    title: "Factorial",
    description: "Write a function that calculates the factorial of a given number.",
    testCases: [{input: "5", output: "120"}, {input: "3", output: "6"}]
  },
  {
    id: "xyz-3",
    title: "Palindrome",
    description: "Write a function that checks if a given string is a palindrome.",
    testCases: [{input: "'racecar'", output: "true"}, {input: "'hello'", output: "false"}]
  },
  {
    id: "xyz-4",
    title: "Fibonacci",
    description: "Write a function that generates the nth number in the Fibonacci sequence.",
    testCases: [{input: "8", output: "21"}, {input: "5", output: "5"}]
  }
];

// An array of objects representing code submissions by users for each question
const SUBMISSIONS = [
  {
    questionId: "xyz-0",
    userId: "abc-0",
    time: "2023-04-10T12:30:00Z",
    solution: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
    isAccepted: false
  },
  {
    questionId: "xyz-1",
    userId: "abc-1",
    time: "2023-04-10T13:15:00Z",
    solution: "function findLongestWord(str) {\n  const words = str.split(' ');\n  let longestWord = '';\n  for (const word of words) {\n    if (word.length > longestWord.length) {\n      longestWord = word;\n    }\n  }\n  return longestWord;\n}",
    isAccepted: true
  },
  {
    questionId: "xyz-2",
    userId: "abc-2",
    time: "2023-04-10T14:00:00Z",
    solution: "function factorial(num) {\n  if (num === 0 || num === 1) {\n    return 1;\n  }\n  return num * factorial(num - 1);\n}",
    isAccepted: false
  },
  {
    questionId: "xyz-3",
    userId: "abc-0",
    time: "2023-04-10T14:45:00Z",
    solution: "function isPalindrome(str) {\n  const reversedStr = str.split('').reverse().join('');\n  return str === reversedStr;\n}",
    isAccepted: true
  },
  {
    questionId: "xyz-4",
    userId: "abc-3",
    time: "2023-04-10T15:30:00Z",
    solution: "function fibonacci(n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
    isAccepted: true
  },
  {
    questionId: "xyz-3",
    userId: "abc-1",
    time: "2023-04-10T16:15:00Z",
    solution: "function isPalindrome(str) {\n  let left = 0;\n  let right = str.length - 1;\n  while (left < right) {\n    if (str[left] !== str[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  return true;\n}",
    isAccepted: true
  }
];


// MIDDLEWARES
// Parse JSON request body as JS objects and adds it to 'req.body' object used in routes
app.use(express.json());


// ROUTES
// Adds a new user to the USERS array, only if the user doesn't exists
app.post("/signup", function (req, res) {
  // Get name, email and password from request body
  const { name, email, password } = req.body;

  // Check if mandatory fields are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are mandatory" });
  }

  // Check if user with the same email already exists
  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    return res
      .status(400)
      .json({ error: "User with the same email already exists" });
  }

  // Create new user object
  const newUser = { name, email, password };

  // Add new user to USERS array
  USERS.push(newUser);

  // Return success response with status code 200
  res.status(200).json({ message: "User created successfully" });
});

// Send backs auth-token is login is successfull
app.post("/login", function (req, res) {
  // Get email and password from request body
  const { email, password } = req.body;

  // Check if email and password are present
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are mandatory" });
  }

  // Check if user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  // Check if password is correct
  if (user.password !== password) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  // Generate a random authentication token (for now)
  const authToken = Math.random().toString(36).substring(2);

  // Send back success response with status code 200 and auth token
  res.status(200).json({ message: "Login successful", authToken: authToken });
});

// Send back all the questions in the questions array
app.get("/questions", function (req, res) {
  res.status(200).json(QUESTIONS);
});

// Sends back all submissions of a question
app.get("/submissions", function (req, res) {
  // Extracting needed arguments from the query
  const { questionId } = req.body;

  // If questionId arg is absent send back error
  if (!questionId) {
    return res
      .status(400)
      .json({ error: "Argument questionId is a mandatory field" });
  }

  // Otherwise, if questionId arg is present send all the submissions for that question
  const submissions = SUBMISSIONS.filter(
    (submission) => submission.questionId === questionId
  );
  res.status(200).json(submissions);
});

// Add a new submission to the SUBMISSIONS array
app.post("/submissions", function (req, res) {
  // Extracting needed arguments from the query
  const { questionId, userId, solution } = req.body;

  // If some of the needed arguments are missing send back error
  if (!questionId || !userId || !solution) {
    return res
      .status(400)
      .json({ error: "questionId, userId, and solution are mandatory fields" });
  }

  // Randomly accepting or rejecting the submission
  const isAccepted = Math.random() < 0.5;

  // Creating a submission object with auto generated time field
  const submission = {
    questionId: questionId,
    userId: userId,
    time: new Date(),
    solution: solution,
    isAccepted: isAccepted,
  };

  // Adding the new submission to the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Send JSON response with `status` denoting accepted/rejected & `message` showing detailed message
  res.status(201).json({
    status: isAccepted ? "accepted" : "rejected",
    message: `Solution is ${isAccepted ? "accepted" : "rejected"}`,
  });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
