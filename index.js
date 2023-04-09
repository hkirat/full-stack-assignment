const express = require('express')
const app = express()
app.use(express.json());
const port = 3001

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
  },
  {
    title: "Reverse a string",
    description: "Write a function that takes a string as input and returns the string reversed.",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "world", output: "dlrow" },
      { input: "12345", output: "54321" }
    ]
  },
  {
    title: "FizzBuzz",
    description: "Write a program that prints the numbers from 1 to 100. But for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'.",
    testCases: [
      { input: 1, output: "1" },
      { input: 3, output: "Fizz" },
      { input: 5, output: "Buzz" },
      { input: 15, output: "FizzBuzz" }
    ]
  },
  {
    title: "Palindrome Checker",
    description: "Write a function that takes a string as input and returns true if it is a palindrome, false otherwise.",
    testCases: [
      { input: "racecar", output: true },
      { input: "hello", output: false },
      { input: "A man a plan a canal Panama", output: true }
    ]
  },
  {
    title: "Fibonacci Series",
    description: "Write a function that takes a number n as input and returns the first n numbers of the Fibonacci series.",
    testCases: [
      { input: 5, output: [0, 1, 1, 2, 3] },
      { input: 10, output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] }
    ]
  },
  {
    title: "Anagram Checker",
    description: "Write a function that takes two strings as input and returns true if they are anagrams, false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
    testCases: [
      { input: ["listen", "silent"], output: true },
      { input: ["hello", "world"], output: false },
      { input: ["astronomer", "moon starer"], output: true }
    ]
  }];


const SUBMISSION = [

]

const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.post('/signup', (req, res) => {
  let {email, password} = req.body;
  const userExists = USERS.some(user => {
    return user.email === email;
  })

  if (!userExists) {
    USERS.push({email, password});
    return res.send(`User ${email} created!`)
  }
  res.send(`User ${email} already exists!`)
})

app.post('/login', function(req, res) {
  let {email, password} = req.body;
  const userExists = USERS.some(user => {
    return user.email === email && user.password === password;
  })
  if (!userExists) {
    return res.status(401).send('Invalid credentials');
  } 
  res.status(200).send({
    "message": 'User Logged In',
    "auth-token": generateRandomString(15)
  })
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
  const {questionId} = req.query;
  const submission = SUBMISSION.filter(subm =>{
    return subm.questionId == questionId;
  })
  res.status(200).send(`Submission for Quesion ${questionId} is ${submission[0].status || 'No Submission'}`)
})


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  let {questionId, code} = req.body;
  SUBMISSION.push(
    {
      userId: 1,
      questionId: questionId,
      code: code,
      status: ['Accepted', 'Rejected'][Math.floor(Math.random() * 2)]
    }
  )
  res.status(200).send("Solution posted!")
});