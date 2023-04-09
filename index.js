const express = require('express')
const app = express()
const port = 3001

// Array of user objects with id, username, email, password, and isAdmin properties
const USERS = [
  {
    id: "abc-0",
    username: "captain_sparkles",
    email: "john_doe@example.com",
    password: "secret",
    isAdmin: false
  },
  {
    id: "abc-1",
    username: "queen_of_the_universe",
    email: "jane_doe@example.com",
    password: "password123",
    isAdmin: true
  },
  {
    id: "abc-2",
    username: "the_dancing_dragon",
    email: "jim_smith@example.com",
    password: "qwerty",
    isAdmin: false
  },
  {
    id: "abc-3",
    username: "king_of_the_castle",
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
const SUBMISSION = [
  {
    questionId: "xyz-0",
    userId: "abc-0",
    time: "2023-04-10T12:30:00Z",
    solution: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}"
  },
  {
    questionId: "xyz-1",
    userId: "abc-1",
    time: "2023-04-10T13:15:00Z",
    solution: "function findLongestWord(str) {\n  const words = str.split(' ');\n  let longestWord = '';\n  for (const word of words) {\n    if (word.length > longestWord.length) {\n      longestWord = word;\n    }\n  }\n  return longestWord;\n}"
  },
  {
    questionId: "xyz-2",
    userId: "abc-2",
    time: "2023-04-10T14:00:00Z",
    solution: "function factorial(num) {\n  if (num === 0 || num === 1) {\n    return 1;\n  }\n  return num * factorial(num - 1);\n}"
  },
  {
    questionId: "xyz-3",
    userId: "abc-0",
    time: "2023-04-10T14:45:00Z",
    solution: "function isPalindrome(str) {\n  const reversedStr = str.split('').reverse().join('');\n  return str === reversedStr;\n}"
  },
  {
    questionId: "xyz-4",
    userId: "abc-3",
    time: "2023-04-10T15:30:00Z",
    solution: "function fibonacci(n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}"
  },
  {
    questionId: "xyz-3",
    userId: "abc-1",
    time: "2023-04-10T16:15:00Z",
    solution: "function isPalindrome(str) {\n  let left = 0;\n  let right = str.length - 1;\n  while (left < right) {\n    if (str[left] !== str[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  return true;\n}"
  }
];

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password


  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)


  // return back 200 status code to the client
  res.send('Hello World!')
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same


  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client


  res.send('Hello World from route 2!')
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  res.send("Hello World from route 4!")
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})