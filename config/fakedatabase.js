let USERS = [];
let SUBMISSIONS = [];
let QUESTIONS = [];

const userExists = (email) => {
  if (USERS.filter((u) => u.email === email).length > 0) {
    return true;
  }
  return false;
};

const addUser = (user) => {
  USERS = [...USERS, user];
};

const getUser = (email) => {
  return USERS.filter((u) => u.email === email)[0];
};

const updateUser = (user) => {
  const index = USERS.findIndex((u) => u.email === user.email);
  USERS[index].email = user.email;
  USERS[index].password = user.password;
  USERS[index].isAdmin = user.isAdmin;
  USERS[index].token = user.token;
};

const getUserSubmissions = (email) => {
  const userSubmissions = SUBMISSIONS.filter((s) => s.userEmail === email);
  if (userSubmissions != null && userSubmissions.length > 0) {
    return userSubmissions;
  }
  return [];
};

const addUserSubmission = (submission) => {
  SUBMISSIONS = [...SUBMISSIONS, submission];
};

const getQuestions = () => {
  return QUESTIONS;
};

const addQuestion = (question) => {
  if (QUESTIONS.length > 0) {
    question.id = QUESTIONS.length;
  }
  QUESTIONS = [...QUESTIONS, question];
};

module.exports = {
  userExists,
  addUser,
  getUser,
  updateUser,
  getUserSubmissions,
  getQuestions,
  addQuestion,
  addUserSubmission,
};
