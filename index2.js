const express = require("express");

const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    id: 2,
    title: "Palindrome Check",
    description: "Write a function to check if a string is a palindrome.",
    testCases: [
      {
        input: "'racecar'",
        output: "true",
      },
      {
        input: "'hello'",
        output: "false",
      },
    ],
  },
  {
    id: 3,
    title: "Factorial",
    description:
      "Write a function to calculate the factorial of a given number.",
    testCases: [
      {
        input: "5",
        output: "120",
      },
      {
        input: "0",
        output: "1",
      },
    ],
  },
  {
    id: 4,
    title: "FizzBuzz",
    description:
      "Write a program that prints the numbers from 1 to 100. But for multiples of three, print 'Fizz' instead of the number and for the multiples of five, print 'Buzz'. For numbers which are multiples of both three and five, print 'FizzBuzz'.",
    testCases: [
      {
        input: "15",
        output: "'FizzBuzz'",
      },
      {
        input: "3",
        output: "'Fizz'",
      },
      {
        input: "5",
        output: "'Buzz'",
      },
      {
        input: "7",
        output: "7",
      },
    ],
  },
  {
    id: 5,
    title: "Reverse Array",
    description: "Write a function to reverse an array.",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "['apple', 'banana', 'orange']",
        output: "['orange', 'banana', 'apple']",
      },
    ],
  },
  {
    id: 6,
    title: "Sum of Even Numbers",
    description:
      "Write a function to calculate the sum of all even numbers in an array.",
    testCases: [
      {
        input: "[1,2,3,4,5,6]",
        output: "12",
      },
      {
        input: "[2,4,6,8,10]",
        output: "30",
      },
    ],
  },
  // Add more questions here...
];

const SUBMISSION = [];

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World from Pritam Sharma");
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  const user = USERS.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    const token = `${email}.randomToken123`;
    res.status(200).json({ token });
  } else {
    res.sendStatus(401).send("User Email Incorrect or Passoword is Wrong");
  }
});

app.post("/signup", function (req, res) {
  const { email, password } = req.body;
  const existingUser = USERS.find((user) => user.email === email);
  if (!existingUser) {
    USERS.push({ email, password });
    res.sendStatus(200).send("User Added Successfully");
  } else {
    res.status(409).send("User already exists");
  }
});

app.get("/questions", function (req, res) {
  const { query } = req.query;
  const numQuestions = parseInt(query);
  const questions = QUESTIONS.slice(0, numQuestions);
  console.log(questions);

  res.json({ questions });
});

app.post("/submissions", function (req, res) {
  const { questionID, answer, userID } = req.body;
  SUBMISSION.push({ questionID, answer, userID });
  res.status(200).send("Submitted Successfully");
});

app.listen(port, function () {
  console.log(`Started Server on ${port}`);
});
