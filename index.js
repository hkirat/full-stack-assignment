const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = 3001

const USERS = [];

const QUESTIONS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    question: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    exampleInput: [2, 7, 11, 15],
    exampleOutput: [0, 1],
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    question: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    exampleInput: 'l1 = [2,4,3], l2 = [5,6,4]',
    exampleOutput: '[7,0,8]',
  },
];



const SUBMISSIONS = [
  {
    id: 1,
    questionId: 1,
    timestamp: new Date('2022-04-07T11:30:00Z'),
    runtime: 56,
    memory: 34.1,
    language: 'JavaScript',
    code: `
      function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) {
            return [map.get(complement), i];
          }
          map.set(nums[i], i);
        }
      }
    `,
    result: 'Accepted',
  },
  {
    id: 2,
    questionId: 2,
    timestamp: new Date('2022-04-07T12:45:00Z'),
    runtime: 72,
    memory: 38.2,
    language: 'JavaScript',
    code: `
      function addTwoNumbers(l1, l2) {
        let carry = 0;
        const dummy = new ListNode(0);
        let cur = dummy;
        while (l1 || l2) {
          const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
          carry = sum >= 10 ? 1 : 0;
          cur.next = new ListNode(sum % 10);
          cur = cur.next;
          if (l1) l1 = l1.next;
          if (l2) l2 = l2.next;
        }
        if (carry > 0) {
          cur.next = new ListNode(carry);
        }
        return dummy.next;
      }
    `,
    result: 'Accepted',
  },
];


app.post('/signup', function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body
  // body should have email and password
  if (!email || !password) {
    return res.status(403).json({
      message: "all fields are required"
    })
  }
  if ((USERS.some(user => user.email === email))) {
    console.log(USERS)
    return res.status(403).json({
      message: "user already exists"
    })
  }
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({ email, password })
  // return back 200 status code to the client
  console.log(USERS)
  res.status(200).json({
    message: "user registered successfully"
  })
})

app.post('/login', function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body

  // Check if the user with the given email exists in the USERS array

  if (!(USERS.some(user => user.email === email))) {
    return res.status(403).json({
      message: "user not registered"
    })
  }
  // Also ensure that the password is the same
  else if (!(USERS.find(user => user.email === email && user.password === password))) {
    console.log((USERS.find(user => user.email === email && user.password === password)))
    return res.status(401).json({
      message: "credentials incorrect"
    })
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.status(200).json({
    message: "logged in successfully",
    token: "randomstring"

  })
})

app.get('/questions', function (req, res) {

  //return the user all the questions in the QUESTIONS array
  res.status(200).json(
    QUESTIONS
  )
})

app.get("/submissions/:questionId", function (req, res) {
  // return the users submissions for this problem
  const questionId = req.params.questionId
  const submission = SUBMISSIONS.find(submission => submission.questionId && submission.questionId == questionId)
  if (!submission) {
    return res.status(404).json({
      message: "No submissions found for this question"
    })
  }
  res.status(200).json(submission)
});


app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionId, runtime, memory, language, code, result } = req.body
  if (!questionId || !runtime || !memory || !language || !code || !result) {
    res.status(403).json({
      message: "all fields are required"
    })
  }
  SUBMISSIONS.push({
    "questionId": questionId,
    "timestamp": `${Date.now()}`,
    "runtime": runtime,
    "memory": memory,
    "language": language,
    "code": code,
    "result": result
  })
  res.status(200).json({
    message: "answer submitted successsfully"
  })
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/addquestion", function (req, res) {
  // token can also be passed
  const ADMINID = "admin";
  const ADMIN_PASSWORD = 123;
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(404).json({
      message: "all fields are required"
    })
  }
  if (!(id === ADMINID && password === ADMIN_PASSWORD)) {
    return res.status(403).json({
      message: "wrong credentials"
    })
  }
  const { question } = req.body;
  QUESTIONS.push(question);
  res.status(200).json({
    message: "Question added successfully"
  })
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})