const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const { auth } = require('./middleware');
const JWT_SECRET = 'secret';
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // For serving static files from public directory
app.use(express.json()); // For parsing application/json
app.use(cors());

let USER_ID_COUNTER = 3;
const USERS = [
  {
    id: '1',
    userName: 'james',
    email: 'james@email.com',
    password: 'james@100',
    role: 'user',
  },
  {
    id: '2',
    userName: 'john',
    email: 'johndoe@email.com',
    password: 'john@100',
    role: 'admin',
  },
];

const QUESTIONS = [
  {
    id: '1',
    title: 'Two Sum',
    description:
      'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    acceptanceRate: '70%',
    difficulty: 'Easy',
    input: [2, 7, 11, 15],
    output: 9,
  },
  {
    id: '2',
    title: 'Reverse String',
    description:
      'Write a function that reverses a string. The input string is given as an array of characters.',
    acceptanceRate: '85%',
    difficulty: 'Easy',
    input: ['h', 'e', 'l', 'l', 'o'],
    output: 'olleh',
  },
  {
    id: '3',
    title: 'Palindrome Number',
    description:
      'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.',
    acceptanceRate: '60%',
    difficulty: 'Medium',
    input: 121,
    output: 'true',
  },
  {
    id: '4',
    title: 'FizzBuzz',
    description:
      'Write a program that outputs the string representation of numbers from 1 to n. But for multiples of three, it should output "Fizz" instead of the number and for the multiples of five output "Buzz". For numbers which are multiples of both three and five, output "FizzBuzz".',
    acceptanceRate: '25%',
    difficulty: 'Hard',
    input: 15,
    output: [
      '1',
      '2',
      'Fizz',
      '4',
      'Buzz',
      'Fizz',
      '7',
      '8',
      'Fizz',
      'Buzz',
      '11',
      'Fizz',
      '13',
      '14',
      'FizzBuzz',
    ],
  },
  {
    id: '5',
    title: 'Valid Parentheses',
    description:
      'Given a string containing just the characters "(", ")", "{", "}", "[", and "]", determine if the input string is valid.',
    acceptanceRate: '80%',
    difficulty: 'Medium',
    input: 'String s = "tailwindcss_is_so{coo)"',
    output: 'true',
  },
  {
    id: '6',
    title: 'Longest Common Prefix',
    description:
      'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    acceptanceRate: '70%',
    difficulty: 'Easy',
    input: ['flower', 'flow', 'flight'],
    output: 'fl',
  },
  {
    id: '7',
    title: 'Merge Two Sorted Lists',
    description:
      'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
    acceptanceRate: '75%',
    difficulty: 'Easy',
    input: [
      [1, 2, 4],
      [1, 3, 4],
    ],
    output: [1, 1, 2, 3, 4, 4],
  },
  {
    id: '8',
    title: 'Reverse Integer',
    description:
      'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.',
    acceptanceRate: '35%',
    difficulty: 'Hard',
    input: 123,
    output: 321,
  },
  {
    id: '9',
    title: 'Valid Anagram',
    description:
      'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    acceptanceRate: '70%',
    difficulty: 'Medium',
    input: ['anagram', 'nagaram'],
    output: 'true',
  },
  {
    id: '10',
    title: 'Remove Duplicates from Sorted Array',
    description:
      'Given a sorted array nums, remove the duplicates in-place such that each element appears only once and returns the new length.',
    acceptanceRate: '75%',
    difficulty: 'Easy',
    input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
    output: 5,
  },
  {
    id: '11',
    title: 'Search Insert Position',
    description:
      'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
    acceptanceRate: '65%',
    difficulty: 'Medium',
    input: [1, 3, 5, 6],
    output: 5,
  },
  {
    id: '12',
    title: 'Valid Palindrome',
    description:
      'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
    acceptanceRate: '70%',
    difficulty: 'Easy',
    input: 'A man, a plan, a canal: Panama',
    output: true,
  },
];

const SUBMISSION = [
  {
    submission: `print('hello world')`,
    problemId: '29',
    userId: '7',
    status: 'WA',
  },
];

app.get('/', (req, res) => {
  res.send('Hello everyone!');
  console.log(USERS);
});

app.post('/signup', (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(401).json({ message: 'Enter all the credentials' });
  }

  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    return res
      .status(403)
      .json({ message: 'User already exists with given email' });
  }

  USERS.push({
    id: `${USER_ID_COUNTER++}`,
    userName,
    email,
    password,
    role: 'user',
  });
  console.log(USERS);
  return res.status(200).json({ message: 'User created successfully' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: 'Enter all the credentials' });
  }

  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(403).json({ message: 'Check the password' });
  } else {
    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );
    const userId = user.id;
    return res.status(200).json({ token, userId });
  }
});

app.get('/me', auth, (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.json({ user });
});

app.get('/question/:id', (req, res) => {
  const id = req.params.id;

  const question = QUESTIONS.find((question) => question.id === id);
  if (!question) {
    return res.status(404).json({ message: 'NOT FOUND!' });
  } else {
    return res.json({ question });
  }
});

app.get('/questions', (req, res) => {
  const filteredQuestions = QUESTIONS.map((question) => ({
    id: question.id,
    title: question.title,
    difficulty: question.difficulty,
    acceptanceRate: question.acceptanceRate,
  }));

  res.json({
    problems: filteredQuestions,
  });
});

app.post('/run', auth, (req, res) => {
  const answer = Math.floor(Math.random() * 2) > 0;
  const problemId = req.body.problemId;
  const submission = req.body.submission;

  if (answer) {
    return res.json({
      status: 'AC',
    });
  } else {
    return res.json({
      status: 'WA',
    });
  }
});

app.get('/submission/:problemId', auth, (req, res) => {
  const problemId = req.params.problemId;

  const submission = SUBMISSION.filter(
    (x) => x.problemId === problemId && x.userId === req.userId
  );
  // console.log(submission);
  res.json({ submission });
});

app.post('/submissions', auth, (req, res) => {
  const answer = Math.floor(Math.random() * 2) > 0;
  const problemId = req.body.problemId;
  const submission = req.body.submission;
  const userId = req.body.userId;

  if (answer) {
    SUBMISSION.push({
      submission,
      problemId,
      userId,
      status: 'AC',
    });
    // console.log(SUBMISSION);
    return res.json({
      submission,
      problemId,
      userId,
      status: 'AC',
    });
  } else {
    SUBMISSION.push({
      submission,
      problemId,
      userId,
      status: 'WA',
    });
    // console.log(SUBMISSION);
    return res.json({
      submission,
      problemId,
      userId,
      status: 'WA',
    });
  }
});

app.post('/admin', (req, res) => {
  const { question } = req.body.question;

  QUESTIONS.push(question);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
