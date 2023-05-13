const express = require('express')
const app = express()
const port = 3001

// Array to store all admins
const ADMINS = ["admin@example.com"];

const USERS = [];

const QUESTIONS = [
  {
    title: "Two Sum",
    description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]"
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]"
      },
      {
        input: "[3,3]\n6",
        output: "[0,1]"
      }
    ]
  },
  {
    title: "Reverse Integer",
    description: "Given a 32-bit signed integer, reverse digits of an integer.",
    testCases: [
      {
        input: "123",
        output: "321"
      },
      {
        input: "-123",
        output: "-321"
      },
      {
        input: "120",
        output: "21"
      }
    ]
  },
  {
    title: "Palindrome Number",
    description: "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    testCases: [
      {
        input: "121",
        output: "true"
      },
      {
        input: "-121",
        output: "false"
      },
      {
        input: "10",
        output: "false"
      }
    ]
  },
  {
    title: "Roman to Integer",
    description: "Given a roman numeral, convert it to an integer. Input is guaranteed to be within the range from 1 to 3999.",
    testCases: [
      {
        input: "III",
        output: "3"
      },
      {
        input: "IV",
        output: "4"
      },
      {
        input: "IX",
        output: "9"
      },
      {
        input: "LVIII",
        output: "58"
      },
      {
        input: "MCMXCIV",
        output: "1994"
      }
    ]
  },
  {
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings.",
    testCases: [
      {
        input: '["flower","flow","flight"]',
        output: '"fl"'
      },
      {
        input: '["dog","racecar","car"]',
        output: '""'
      },

    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    testCases: [
      {
        input: '"()"',
        output: "true"
      },
      {
        input: '"()[]{}"',
        output: "true"
      },
      {
        input: '"(]"',
        output: "false"
      },
      {
        input: '"([)]"',
        output: "false"
      },
      {
        input: '""',
        output: "true"
      }
    ]
  },
  {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    testCases: [
      {
        input: '[[1,2,4],[1,3,4]]',
        output: "[1,1,2,3,4,4]"
      },
      {
        input: '[[],[]]',
        output: "[]"
      },
      {
        input: '[[1],[2]]',
        output: "[1,2]"
      }
    ]
  }
];

const SUBMISSIONS = [

]

// Add middleware to parse JSON bodies
app.use(express.json())

// Middleware function to check if user is admin
function isAdmin(req, res, next) {
  if (ADMINS.includes(req.body.email)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.post('/signup', function (req, res) {
  // Check if the request body is empty
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is empty' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const userExists = USERS.some(user => user.email === email)

  // If the user already exists, send an error response
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' })
  }

  // If the user doesn't exist, add them to the USERS array
  USERS.push({ email, password })

  // Send a success response
  res.status(200).json({ message: 'User created successfully' })
})

app.post('/login', function (req, res) {

  // Check if the request body is empty

  if (!req.body) {
    return res.status(400).json({ error: 'Request body is empty' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = USERS.find(user => user.email === email);

  if (!user) {
    // If the user does not exist, return 401 Unauthorized status code
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.password !== password) {
    // If the password is incorrect, return 401 Unauthorized status code
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // If the password is correct, generate and return an access token
  const accessToken = Math.random().toString(36).substring(2, 15);
  res.json({ accessToken });
})

app.get('/questions', function (req, res) {

  // Return the user all the questions in the QUESTIONS array
  res.json({ questions: QUESTIONS });
})

app.get("/submissions", function (req, res) {
  // Return all submissions
  res.send(SUBMISSIONS);
});


app.post("/submissions", function (req, res) {
  const submission = req.body;

  // Randomly accept or reject the submission
  const isAccepted = Math.random() < 0.5;
  submission.isAccepted = isAccepted;

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Return a response indicating whether the submission was accepted or rejected
  if (isAccepted) {
    res.status(200).send("Submission accepted!");
  } else {
    res.status(400).send("Submission rejected!");
  }
});

// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/problems", isAdmin, function (req, res) {
  const { email, ...problem } = req.body;

  // Add problem to the QUESTIONS array
  QUESTIONS.push(problem);

  res.status(200).send("Problem added successfully!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})