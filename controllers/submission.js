exports.getAllSubmissions = (req, res) => {
    const { user_id } = req.user;
    const user_submissions = global.SUBMISSIONS.filter(submission => submission.user_id === user_id);
    res.json(user_submissions);
  }

exports.createSubmission = (req, res) => {
    const { user_id } = req.user;
    const { question_id, solution } = req.body;
    
    const submission = { user_id, question_id, solution };
    global.SUBMISSIONS.push(submission);
    res.status(201).json(submission);
  }