const QUESTIONS = [
  {
    title: 'Two states',
    description: 'Given an array , return the maximum of the array?',
    testCases: [
      {
        input: '[1,2,3,4,5]',
        output: '5',
      },
    ],
  },
];

exports.questions = (req, res) => {
  // Return all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
};
