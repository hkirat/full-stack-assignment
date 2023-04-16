const moment = require("moment");

const users = [
  {
    email: "admin@local.com",
    password: "password",
    role: "admin",
    key: `${Date.now()}randomString`,
    keyExpiry: moment().add("minutes", 10).toDate(),
    // questions:{ questionId:[submissions]}
    questions: {},
  },
  {
    email: "shubham@local.com",
    password: "password",
    role: "user",
    key: `${Date.now()}randomString`,
    keyExpiry: moment().add("minutes", 10).toDate(),
    questions: {},
  },
];

const roleWisePermissions = {
  admin: {
    questions: { create: true, read: true, delete: true, update: true },
    submissions: { create: true, read: true, delete: false, update: false },
  },
  user: {
    questions: { create: true, read: true, delete: false, update: false },
    submissions: { create: true, read: true, delete: false, update: false },
  },
};

const questions = [
  {
    _id: 0,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    _id: 1,
    title: "three states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    _id: 2,
    title: "four states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];
module.exports = { users, roleWisePermissions, questions };
