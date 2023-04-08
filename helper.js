const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

// Signup Function
// use async and await or Promises if you are integrating DB
function signUp(req){
   try{
    const {email, password} = req.body;

    //check if email is already exist in Users array.
    const isEmailExist = USERS.some((user)=> user?.email === email);
    
    //if email is not exist add email and pwd to the user array
    if(!isEmailExist) {
      USERS.push({email, password});
      return {
        error: false,
        message: 'Registartion Successfully completed'
      }
    }else if(isEmailExist){
        return {
            error: true,
            message: 'Email already exist, please try with another email'
        }
    }
   } catch(err){
      return null;
   }
}

//Login Function, login with email and password
function login(req){
    try{
        const {email, password} = req.body;

        //check if email is already exist in Users array.
        const user = USERS.find((user)=> user?.email === email);
        
        //check if user exist and password matches in the users array
        if(user && user.password === password) {
            return {
                error: false,
                message: 'User loggedin successfull',
                token: Math.random().toString(36).substring(7)
            }
        }else {
            return {
                error: true,
                message: 'Invalid username and password combination.'
            }
        }
    } catch(err){
        return null;
    }
}

//getQuestions, returns all the questions in the questions List
function getQuestions(){
    try{
        //check if Question in the array, then return the Questions List
        if(QUESTIONS.length > 0) {
            return {
                error: false,
                questions: QUESTIONS
            }
        }else {
            return {
                error: true,
                message: 'No Questions are in list now'
            }
        }
    } catch(err){
        return null;
    }
}

//getSubmissions, returns all the questions in the submissions List
function getSubmissions(){
    try{
        //check if Submission in the array, then return the submissions List
        if(SUBMISSION.length > 0) {
            return {
                error: false,
                submission: SUBMISSION
            }
        }else {
            return {
                error: true,
                message: 'No Submissions are in list now'
            }
        }
    } catch(err){
        return null;
    }
}

//postSubmission, will post hte all submissions into the submission array.
function postSubmission(req){
   try{
        const { problemIndex, solution } = req.body;

        // Randomly accept or reject the solution
        const isAccepted = Math.random() < 0.5;
        
        //check if user exist and password matches in the users array
        if(problemIndex && solution) {
            SUBMISSION.push({problemIndex, solution, isAccepted})
            return {
                error: false,
                message: 'Solution submitted succesfull'
            }
        }else {
            return {
                error: true,
                message: 'Problem and Solution should not be Empty'
            }
        }
    } catch(err){
        return null;
    }

}

function adminAddProblem(req){
    try{
        const { title, description, testCases } = req.body;

        const newProblem = { title, description, testCases };
        
        //check if Problem has values or not
        if(newProblem) {
            QUESTIONS.push(newProblem)
            return {
                error: false,
                message: 'Problem submitted succesfull'
            }
        }else {
            return {
                error: true,
                message: 'Problem should not be Empty'
            }
        }
    } catch(err){
        return null;
    }
}

module.exports = { signUp, login, getQuestions, getSubmissions, postSubmission, adminAddProblem }