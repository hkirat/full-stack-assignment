const SUBMISSIONS = [
{
    submissionId: 1,
    questionId: 1,
    userId: 'test123@yopmail.com',
    code: "function getMax(arr) { return Math.max(...arr); }",
    language: "javascript",
    status: "accepted",
    createdAt: new Date("2022-01-08T00:00:00Z")
},
{
    submissionId: 2,
    questionId: 1,
    userId: 'test234@yopmail.com',
    code: "def getMax(arr):\n  return max(arr)",
    language: "python",
    status: "rejected",
    createdAt: new Date("2022-01-09T00:00:00Z")
},
{
    submissionId: 3,
    questionId: 2,
    userId: 'test123@yopmail.com',
    code: "function concatenateStrings(str1, str2) { return str1 + str2; }",
    language: "javascript",
    status: "accepted",
    createdAt: new Date("2022-01-10T00:00:00Z")
},
{
    submissionId: 4,
    questionId: 2,
    userId: 'test234@yopmail.com',
    code: "def concatenateStrings(str1, str2):\n  return str1 + str2",
    language: "python",
    status: "rejected",
    createdAt: new Date("2022-01-11T00:00:00Z")
},
{
    submissionId: 5,
    questionId: 3,
    userId: 'test123@yopmail.com',
    code: "function getStringLength(str) { return str.length; }",
    language: "javascript",
    status: "accepted",
    createdAt: new Date("2022-01-12T00:00:00Z")
},
{
    submissionId: 6,
    questionId: 3,
    userId: 'test234@yopmail.com',
    code: "def getStringLength(str):\n  return len(str)",
    language: "python",
    status: "rejected",
    createdAt: new Date("2022-01-13T00:00:00Z")
},
{
    submissionId: 7,
    questionId: 1,
    userId: 'test123@yopmail.com',
    code: "function getMax(arr) {\n  return arr.reduce((max, current) => current > max ? current : max, arr[0]);\n}",
    language: "javascript",
    status: "accepted",
    createdAt: new Date("2022-01-14T00:00:00Z")
},
{
    submissionId: 8,
    questionId: 2,
    userId: 'test234@yopmail.com',
    code: "def concatenateStrings(str1, str2):\n  return f'{str1}{str2}'",
    language: "python",
    status: "accepted",
    createdAt: new Date("2022-01-15T00:00:00Z")
},
{
    submissionId: 9,
    questionId: 3,
    userId: 'test123@yopmail.com',
    code: "function getStringLength(str) {\n  let count = 0;\n  for (let i = 0; i < str.length; i++) {\n    count++;\n  }\n  return count;\n}",
    language: "javascript",
    status: "accepted",
    createdAt: new Date("2022-01-16T00:00:00Z")
}
];
module.exports = SUBMISSIONS;
