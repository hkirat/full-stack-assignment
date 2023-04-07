exports.createQuestion =  (req, res) => {
    const { user_type } = req.user;
    
    // Only allow admins to add questions
    if (user_type === 'admin') {
      const { question_text } = req.body;
      const question_id = global.QUESTIONS.length + 1;
      const question = { question_id, question_text };
      
      global.QUESTIONS.push(question);
      console.log(global.QUESTIONS);
      res.status(201).json(question);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.getAllQuestions = (req, res) => {
    res.json(global.QUESTIONS);
}