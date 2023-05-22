const { ADMIN, QUESTIONS } = require("../../database");

const postQuestions = (req, res) => {
  const { adminEmail } = req.params;

  let isAdmin = false;
  ADMIN.forEach((user) => {
    if (user.email === adminEmail) {
      isAdmin = true;
    }
  });

  if (isAdmin) {
    const { title, description, testCases } = req.body;
    QUESTIONS.push({ title, description, testCases });
    console.log(QUESTIONS);
    res.status(201).send("Question added successfully");
  }
  if (!isAdmin) res.status(401).send("Not a Admin to create questions ");
};

module.exports = postQuestions;
