const QUESTIONS = [  
{   
    title: "Two states",    
    description: "Given an array, return the maximum of the array?",    
    testCases: [      
    {        
        input: "[1,2,3,4,5]",        
        output: "5"      
    }    
    ],
    likes: 10,
    dislikes: 2,
    createdAt: new Date("2022-01-01T00:00:00Z")
},
{
    title: "Concatenation",
    description: "Given two strings, concatenate them together?",
    testCases: [
    {
        input: '["hello", "world"]',
        output: "helloworld"
    },
    {
        input: '["foo", "bar"]',
        output: "foobar"
    }
    ],
    likes: 8,
    dislikes: 1,
    createdAt: new Date("2022-01-02T00:00:00Z")
},
{
    title: "String Length",
    description: "Given a string, return its length?",
    testCases: [
    {
        input: '"hello world"',
        output: "11"
    },
    {
        input: '"foobar"',
        output: "6"
    }
    ],
    likes: 15,
    dislikes: 3,
    createdAt: new Date("2022-01-03T00:00:00Z")
},
{
    title: "Palindrome Check",
    description: "Given a string, check if it is a palindrome?",
    testCases: [
    {
        input: '"racecar"',
        output: "true"
    },
    {
        input: '"hello"',
        output: "false"
    }
    ],
    likes: 5,
    dislikes: 0,
    createdAt: new Date("2022-01-04T00:00:00Z")
},
{
    title: "Factorial",
    description: "Given a number, compute its factorial?",
    testCases: [
    {
        input: "5",
        output: "120"
    },
    {
        input: "10",
        output: "3628800"
    }
    ],
    likes: 3,
    dislikes: 1,
    createdAt: new Date("2022-01-05T00:00:00Z")
},
{
    title: "Fibonacci Sequence",
    description: "Given a number n, generate the first n numbers in the Fibonacci sequence?",
    testCases: [
    {
        input: "5",
        output: "[0,1,1,2,3]"
    },
    {
        input: "10",
        output: "[0,1,1,2,3,5,8,13,21,34]"
    }
    ],
    likes: 7,
    dislikes: 2,
    createdAt: new Date("2022-01-06T00:00:00Z")
},
{
    title: "Sum of Digits",
    description: "Given a number, compute the sum of its digits?",
    testCases: [
    {
        input: "12345",
        output: "15"
    },
    {
        input: "9876",
        output: "30"
    }
    ],
    likes: 4,
    dislikes: 0,
    createdAt: new Date("2022-01-07T00:00:00Z")
}
];
module.exports = QUESTIONS;