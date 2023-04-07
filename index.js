import express from 'express';
import { ERROR_MESSAGE, EMAIL_REGEX, ROLES, LANGUAGES } from './utils.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { generateJwt, validateToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Loads .env file contents into process.env.
dotenv.config();

const port = process.env.PORT;

app.use(express.json());

export const USERS = new Map();

const QUESTIONS = new Map();

QUESTIONS.set('random-question-id', {
  questionId: 'random-question-id',
  title: 'Find maximum of array',
  description: 'Given an array , return the maximum of the array?',
  testCases: [
    {
      input: '[1,2,3,4,5]',
      output: '5',
    },
  ],
});

const SUBMISSION = new Map();

SUBMISSION.set('random-submission-id', {
  sumissionId: 'random-submission-id',
  questionId: 'random-question-id',
  user: 'random@user.com',
  language: LANGUAGES.js,
  code: 'fun(arr){return arr.max()}',
  isAccepted: true,
});

app.post('/signup', async function (req, res) {
  const { email, password, adminSecret } = req.body;

  const isValidEmail = EMAIL_REGEX.test(email);

  if (email && password && isValidEmail) {
    if (USERS.has(email)) {
      res.status(400).json({ message: ERROR_MESSAGE.EMAIL_EXISTS });
    } else {
      const hash = await bcrypt.hash(password, 10);
      let role = ROLES.USER;

      if (typeof adminSecret === 'string') {
        if (adminSecret === process.env.ADMIN_ACCOUNT_CREATION_SECRET) {
          role = ROLES.ADMIN;
        } else {
          res.status(400).json({ message: 'Invalid Admin secret' });
          return;
        }
      }

      USERS.set(email, {
        password: hash,
        role: role,
      });

      res.json({ message: 'Signup success' });
    }
  } else {
    res.status(400).json({
      message: isValidEmail
        ? ERROR_MESSAGE.BAD_REQUEST
        : ERROR_MESSAGE.INVALID_EMAIL,
    });
  }
});

app.post('/login', async function (req, res) {
  const { email, password } = req.body;

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password.trim()
  ) {
    res.status(400).json({ message: ERROR_MESSAGE.BAD_REQUEST });
    return;
  }

  try {
    const user = USERS.get(email);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.json({ token: generateJwt(email, user.role) });
        return;
      }
    }
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }

  res.status(401).json({ message: ERROR_MESSAGE.INVALID_CREDENTIALS });
});

app.get('/questions', validateToken, function (req, res) {
  res.json(Array.from(QUESTIONS.values()));
});

app.get('/submissions/:questionId', validateToken, function (req, res) {
  const questionId = req.params['questionId'];

  if (!QUESTIONS.has(questionId)) {
    res.status(404).json({ message: ERROR_MESSAGE.QUESTION_NOT_FOUND });
    return;
  }

  const submissions = Array.from(SUBMISSION.values()).filter(
    (xs) => xs.questionId === questionId
  );
  res.json(submissions);
});

app.post('/submissions', validateToken, function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionId, language, code } = req.body;

  if (
    typeof questionId !== 'string' ||
    typeof language !== 'string' ||
    typeof code !== 'string' ||
    !questionId.trim() ||
    !language.trim() ||
    !code.trim()
  ) {
    res.status(400).json({ message: ERROR_MESSAGE.BAD_REQUEST });
    return;
  }

  if (!QUESTIONS.has(questionId)) {
    res.status(404).json({ message: ERROR_MESSAGE.QUESTION_NOT_FOUND });
    return;
  }

  if (!Object.values(LANGUAGES).includes(language)) {
    res.status(404).json({ message: ERROR_MESSAGE.LANGUAGE_NOT_FOUND });
    return;
  }

  const submission = {
    submissionId: uuidv4(),
    questionId: questionId,
    language: language,
    code: code,
    isAccepted: [true, false][Math.round(Math.random())],
  };

  SUBMISSION.set(submission.submissionId, submission);

  res.json({
    isAccepted: submission.isAccepted,
  });
});

app.post('/question', validateToken, function (req, res) {
  if (req.user.role !== ROLES.ADMIN) {
    res.status(403).send({ message: ERROR_MESSAGE.OPERATION_NOT_PERMITTED });
  }

  const { title, description, testCases } = req.body;

  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    !title.trim() ||
    !title.trim()
  ) {
    res.status(400).json({ message: ERROR_MESSAGE.BAD_REQUEST });
    return;
  }

  const question = {
    questionId: uuidv4(),
    title: title,
    description: description,
    testCases: testCases,
  };
  QUESTIONS.set(question.questionId, question);
  res.json({ message: 'Question added successfully' });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
