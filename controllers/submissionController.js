const SUBMISSIONS = [
  {
    questionId: 0,
    userId: 123,
    submittedAt: '2022-03-15T08:00:00.000Z',
    code: 'function max(arr) { return Math.max(...arr); }',
    result: true,
  },
  {
    questionId: 1,
    userId: 123,
    submittedAt: '2022-03-15T09:00:00.000Z',
    code: 'function min(arr) { return Math.min(...arr); }',
    result: true,
  },
];

exports.getSubmissions = (req, res) => {
  const questionId = req.query.questionId; // get the questionId from the query parameters
  const userId = req.query.userId; // get the userId from the query parameters

  // Filter the submissions array based on the provided questionId and userId (if any)
  const filteredSubmissions = SUBMISSIONS.filter((submission) => {
    return (
      (!questionId || submission.questionId === parseInt(questionId)) && // check if the questionId matches (if provided)
      (!userId || submission.userId === parseInt(userId)) // check if the userId matches (if provided)
    );
  });

  // Return the filtered submissions
  res.status(200).send(filteredSubmissions);
};

exports.postSubmission = (req, res) => {
  const userId = req.body.userId; // Get the userId from the request body
  const questionId = req.body.questionId; // Get the questionId from the request body
  const code = req.body.code; // Get the code from the request body
  const submittedAt = new Date().toISOString(); // Set the submission timestamp to the current time

  // Randomly accept or reject the submission
  const isAccepted = Math.random() < 0.5; // 50% chance of being accepted

  // Create a new submission object with the provided properties and the random acceptance status
  const submission = {
    userId,
    questionId,
    code,
    submittedAt,
    isAccepted,
  };

  // Add the submission to the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Return a JSON response with the submission object and a status code of 200
  res.status(200).json(submission);
};
