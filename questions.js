const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "5",
      },
    ],
  },
  {
    title: "Reverse a String",
    description: "Given a string, reverse its characters.",
    testCases: [
      {
        input: "'Hello, World!'",
        output: "'!dlroW ,olleH'",
      },
    ],
  },
  {
    title: "Check Palindrome",
    description: "Given a string, check if it is a palindrome.",
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
    title: "Fibonacci Sequence",
    description:
      "Given an integer n, return the nth number in the Fibonacci sequence.",
    testCases: [
      {
        input: "5",
        output: "3",
      },
      {
        input: "10",
        output: "55",
      },
    ],
  },
];

module.exports = QUESTIONS;
