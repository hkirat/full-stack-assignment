const getAllQuestions = (req, res) => {
  return res.status(200).json({ data: { questions: QUESTIONS } });
};

export { getAllQuestions };
