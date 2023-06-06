const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];
const SUBMISSION = [
  {
    user: "sumana@gmail.com",
    function: "maxArray",
    code: "(arr) => Math.max(...arr)",
  },
  {
    user: "demo@gmail.com",
    function: "maxArray",
    code: "(arr) => arr.reduce((prev, curr) => (prev > curr ? prev : curr))",
  },
];

exports.questions = (req, res) => {
  res.status(200).send(QUESTIONS);
};

exports.submissions = (req, res) => {
  res.status(200).send(SUBMISSION);
};

exports.submission = (req, res) => {
  const { problem, solution } = req.body;

  const newObj = {
    problem,
    solution,
  };

  if (Math.round(Math.random())) {
    SUBMISSION.push(newObj);
    return res.send("Solution Accepted");
  }

  return res.status(401).send("Solution Not Accepted");
};
