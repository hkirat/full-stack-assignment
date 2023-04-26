const { QUESTIONS } = require("../model/Questions");
const { SUBMISSIONS } = require("../model/Submission");
const { USERS } = require("../model/Users");

/* -------------------------------------------------------------------------- */
/*                          QUESTION LIST FORMATTING                          */
/* -------------------------------------------------------------------------- */
exports.formatQuestionsList = () => {
  const result = QUESTIONS.map((_question) => {
    //replacing creatorId with creator
    const { creatorId, ...restQuestion } = _question;

    //populating creator
    const currentUser = USERS.find((user) => user.id === creatorId);
    const { id, email } = currentUser;

    const submissions = SUBMISSIONS.filter(
      (submission) => submission.questionId === _question.id
    );

    const totalAccepted = submissions.filter(
      (submission) => submission.status === "Accepted"
    );

    const percent = (totalAccepted.length / submissions.length) * 100;

    // final object
    return {
      ...restQuestion,
      percent,
      creator: {
        id,
        email,
      },
    };
  });

  return result;
};

/* -------------------------------------------------------------------------- */
/*                         SINGLE QUESTION FORMATTING                         */
/* -------------------------------------------------------------------------- */
exports.formatQuestion = (question) => {
  //replacing creatorId with creator
  const { creatorId, ...restQuestion } = question;
  //populating creator
  const currentUser = USERS.find((user) => user.id === creatorId);
  const { id, email } = currentUser;
  // final object
  const result = {
    ...restQuestion,
    creator: {
      id,
      email,
    },
  };

  return result;
};

/* -------------------------------------------------------------------------- */
/*                        SUBMISSIONS LIST FORMATTING                         */
/* -------------------------------------------------------------------------- */
exports.formatSubmissionsList = () => {
  const result = SUBMISSIONS.map((_submission) => {
    //replacing userId with user && questionId with question title and description
    const { userId, questionId, ...restSubmission } = _submission;
    //populating user
    const currentUser = USERS.find((user) => user.id === userId);
    const { id, email } = currentUser;

    //populating question
    const currentQuestion = QUESTIONS.find(
      (question) => question.id === questionId
    );
    const { title, description } = currentQuestion;

    // final object
    return {
      ...restSubmission,
      question: {
        id: questionId,
        title,
        description,
      },
      submittedBy: {
        id,
        email,
      },
    };
  });

  return result;
};

/* -------------------------------------------------------------------------- */
/*                        SUBMISSION FORMATTED                                */
/* -------------------------------------------------------------------------- */
exports.formatSingleSubmission = (userId, questionId) => {
  const submission = SUBMISSIONS.find(
    (_submission) =>
      _submission.questionId === questionId && _submission.userId === userId
  );

  if (!submission) return {};

  const {
    questionId: subQuestionId,
    userId: subUserId,
    ...restSubmission
  } = submission;

  //populating user
  const currentUser = USERS.find((user) => user.id === userId);
  const { id, email } = currentUser;

  //populating question
  const currentQuestion = QUESTIONS.find(
    (question) => question.id === questionId
  );
  const { title, description } = currentQuestion;

  // final object
  return {
    ...restSubmission,
    question: {
      id: questionId,
      title,
      description,
    },
    submittedBy: {
      id,
      email,
    },
  };
};

/* -------------------------------------------------------------------------- */
/*                        SINGLE SUBMISSIONS FORMATTING                       */
/* -------------------------------------------------------------------------- */
exports.formatSubmission = (submission) => {
  //replacing userId with user && questionId with question title and description
  const { userId, questionId, ...restSubmission } = submission;
  //populating user
  const currentUser = USERS.find((user) => user.id === userId);
  const { id, email } = currentUser;

  //populating question
  const currentQuestion = QUESTIONS.find(
    (question) => question.id === questionId
  );
  const { title, description } = currentQuestion;

  // final object
  const result = {
    ...restSubmission,
    question: {
      id: questionId,
      title,
      description,
    },
    submittedBy: {
      id,
      email,
    },
  };

  return result;
};

/* -------------------------------------------------------------------------- */
/*                            USERS LIST FORMATTING                           */
/* -------------------------------------------------------------------------- */

exports.formatUsersList = (userId) => {
  const result = USERS.map((user) => {
    const { password, ...restUser } = user;
    return restUser;
  });

  return result;
};

/* -------------------------------------------------------------------------- */
/*                    LOGGED IN USER STATISTICS FORMATTING                    */
/* -------------------------------------------------------------------------- */
exports.formatStatistics = (userId) => {
  const submissions = SUBMISSIONS.filter(
    (submission) => submission.userId === userId
  );

  // total number of submissions
  submissionsCount = submissions.length;

  // pass count/percentage
  const passCount = submissions.filter(
    (submission) => submission.status === "Accepted"
  ).length;
  const passPercent = (passCount / submissionsCount) * 100;

  // fail count/percentage
  const failCount = submissions.length - passCount;
  const failPercent = (failCount / submissionsCount) * 100;

  const result = {
    totalQuestionAttempted: submissionsCount,
    pass: {
      count: passCount,
      percent: passPercent,
    },
    fail: {
      count: failCount,
      percent: failPercent,
    },
  };

  return result;
};
