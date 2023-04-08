let QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
      {
        input: "[-10,-5,0,5,10]",
        output: "10",
      },
      {
        input: "[3,7,2,8,4]",
        output: "8",
      },
    ],
  },
  {
    id: 2,
    title: "Palindrome",
    description: "Given a string, determine if it is a palindrome",
    testCases: [
      {
        input: "racecar",
        output: "true",
      },
      {
        input: "hello",
        output: "false",
      },
      {
        input: "A man a plan a canal Panama",
        output: "true",
      },
    ],
  },
  {
    id: 3,
    title: "FizzBuzz",
    description:
      "Print the numbers from 1 to n, but for multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', and for multiples of both 3 and 5 print 'FizzBuzz'",
    testCases: [
      {
        input: "15",
        output:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      },
      {
        input: "7",
        output: "1\n2\nFizz\n4\nBuzz\nFizz\n7",
      },
      {
        input: "10",
        output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz",
      },
    ],
  },
];

module.exports = QUESTIONS;
