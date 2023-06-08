const express = require('express')
const app = express()
const port = 3001

const Users = [];
const QUESTIONS = [
  {
    questionId: "1",
    title: "Maximum Element",
    description: "Given an array, return the maximum element in the array.",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "5"
      },
      {
        input: "[9, 7, 2, 5, 10]",
        output: "10"
      },
      {
        input: "[5, 5, 5, 5, 5]",
        output: "5"
      }
    ]
  },
  {
    questionId: "2",
    title: "Sum of Two Numbers",
    description: "Given two numbers, return their sum.",
    testCases: [
      {
        input: "3, 4",
        output: "7"
      },
      {
        input: "-5, 10",
        output: "5"
      },
      {
        input: "0, 0",
        output: "0"
      }
    ]
  },
  {
    questionId: "3",
    title: "Factorial",
    description: "Given a number, calculate its factorial.",
    testCases: [
      {
        input: "5",
        output: "120"
      },
      {
        input: "1",
        output: "1"
      },
      {
        input: "0",
        output: "1"
      }
    ]
  },
  {
    questionId: "4",
    title: "Reverse String",
    description: "Given a string, reverse it.",
    testCases: [
      {
        input: "'hello'",
        output: "'olleh'"
      },
      {
        input: "'openai'",
        output: "'ianepo'"
      },
      {
        input: "'algorithm'",
        output: "'mhtirogla'"
      }
    ]
  },
  {
    questionId: "5",
    title: "Palindrome Check",
    description: "Given a string, check if it is a palindrome.",
    testCases: [
      {
        input: "'level'",
        output: "true"
      },
      {
        input: "'hello'",
        output: "false"
      },
      {
        input: "'racecar'",
        output: "true"
      }
    ]
  },
  {
    questionId: "6",
    title: "Fibonacci Sequence",
    description: "Given a number 'n', return the 'n'th number in the Fibonacci sequence.",
    testCases: [
      {
        input: "0",
        output: "0"
      },
      {
        input: "6",
        output: "8"
      },
      {
        input: "10",
        output: "55"
      }
    ]
  },
  {
    questionId: "7",
    title: "Linear Search",
    description: "Given an array and a target element, find the index of the target element in the array (or -1 if not found).",
    testCases: [
      {
        input: "[1, 3, 5, 7, 9], 5",
        output: "2"
      },
      {
        input: "[4, 8, 2, 6, 10], 12",
        output: "-1"
      },
      {
        input: "[1, 2, 3, 4, 5], 3",
        output: "2"
      }
    ]
  },
  {
    questionId: "8",
    title: "Bubble Sort",
    description: "Given an array, sort it in non-decreasing order using the Bubble Sort algorithm.",
    testCases: [
      {
        input: "[5, 2, 8, 12, 1]",
        output: "[1, 2, 5, 8, 12]"
      },
      {
        input: "[9, 4, 7, 3, 1]",
        output: "[1, 3, 4, 7, 9]"
      },
      {
        input: "[2, 10, 5, 3, 6]",
        output: "[2, 3, 5, 6, 10]"
      }
    ]
  }
];
const SUBMISSIONS = [
  {
    userId: "1",
    questionId: "1",
    code: "function max(arr) { return Math.max(...arr) }",
    status: "accepted"
  },
  {
    userId: "1",
    questionId: "1",
    code: "function max(arr) { return Math.min(...arr) }",
    status: "rejected"
  }
];

function generateToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for(let i = 0; i < 32; i++) {
    const randomIndex = Math.ceil(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

app.post('/signup', (req, res) => {
  // decoding the body
  const { email, password } = req.body;

  // checking if the user exists
  const userExists = Users.some(user => user.email === email);

  if(userExists) {
    res.status(409).send("User already exists!");
  }

  // pushing email and password in the array of Users
  Users.push({ email, password });
  // status code 200
  res.status(200).send("Sign Up successful!");
})

app.post('/login', (req, res) => {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = Users.find(user => user.email === email);
  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  if(!user || user.password !== password) {
    res.status(401).send("Invalid password or email!")
  }

  const token = generateToken();

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  res.status(200).send("Login successful!").send(token);
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  const formattedQuestions = QUESTIONS.map((question) => {
    const formattedTestCases = question.testCases.map((testCase, testCaseIndex) => {
      return `Test Case ${testCaseIndex + 1}: Input: ${testCase.input}, Output: ${testCase.output}`;
    });

    return `Question_Id ${question.questionId}:<br>Title: ${question.title}<br>Description: ${question.description}<br>Test Cases:<br>${formattedTestCases.join('<br>')}<br>`;
  });

  const response = formattedQuestions.join('<br>---------------------<br><br>');
  res.send(response);
})

app.get("/submissions", function(req, res) {
  const formattedSubmissions = SUBMISSIONS.map((submission) => {
    return `Question_Id ${submission.questionId}:<br>UserId: ${submission.userId}<br>Code: ${submission.code}<br>Status: ${submission.status}<br>`
  });
  const response = formattedSubmissions.join('<br>---------------------<br><br>');
  res.send(response);
});

app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { userId, questionId, code } = req.body;

  const randomStatus = Math.random() < 0.5 ? "rejected": "accepted";

  const newSubmission = {
    userId,
    questionId,
    code,
    status: randomStatus
  }
  // Store the submission in the SUBMISSION array above
  SUBMISSIONS.push(newSubmission);
  res.send("Submitted!")
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})