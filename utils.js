let USERS_OBJ = [];

let QUESTIONS = [{
    title: "Two states",
    problemId: "1",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
    }]
  }];

let SUBMISSIONS = [];

function addUser(user) {
    var isPresent = doesUserExist(user);

    if (!isPresent) {
        USERS_OBJ.push(user);
    }

}

function displayUserObj(){
    console.log(USERS_OBJ);
}

function doesUserExist(user) {
    for (const { email,password } of USERS_OBJ) {
        if (email === user.email && password === user.password) {
          return true;
        }
      }
      return false;
}

function displayQuestions(){
    return QUESTIONS;
}

function addNewSubmission(solution){
    SUBMISSIONS.push(solution);
}

module.exports = {
    USERS_OBJ,
    QUESTIONS,
    SUBMISSIONS,
    addUser,
    doesUserExist,
    displayUserObj,
    displayQuestions,
    addNewSubmission
};
