export const EMAIL_REGEX = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

export const ERROR_MESSAGE = {
  BAD_REQUEST: 'Bad Request',
  INVALID_EMAIL: 'Invalid Email',
  EMAIL_EXISTS: 'Email already taken',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMPTY_TOKEN: 'Token not present',
  INVALID_TOKEN: 'Invalid token',
  QUESTION_NOT_FOUND: 'Question not found',
  LANGUAGE_NOT_FOUND: 'Language not found',
  OPERATION_NOT_PERMITTED: 'Operation not permitted',
};

export const ROLES = {
  USER: 'User',
  ADMIN: 'Admin',
};

export const LANGUAGES = {
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
  js: 'Java Script',
  ts: 'Type Script',
};
