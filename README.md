#This is an open source Full-Stack-Project project create by @https://github.com/hkirat.
The project will be to Create a website similar to Leetcode. The Project will be Completed in 3 phases.
`Backend` , `FrontEnd`- Integration of Backend and FrontEnd, `Some Advance tools for Full Stack`.

# Phase 1 - BackEnd

Phase one has currently 6 API's. 
### SIGNUP API "/signup" - this API Allows a user to create an Account (as in backend for now) in out Application/Website. 
It checks basic things like users email and password and created an Account with the given details.
Since we are not using any database the details are stored temporarily yet in Users Array. 

### LOGIN API "/login" - This API allows users to Login in to his/her account. This checks the email if present in users Array
and password with should with the given user emails password. If not we will get an Authentication Error Else generating 
a Token for the user to proceed further. (Token can be created randomly or using JWT ).

### QUESTIONS API "/questions"- This API gives in return all of the Questions that are present in the questions array. This is a Get Request.

### SUBMISSIONS API "/submissions" - This API returns All the submissions all the users that are present
in the Submission Array. This is a get Request.

### SUBMISSION API "/submissions"- This API Allows users to create submissions for the questions.
Some constraints are Question should be present in the quesion array and title should match the id of the question(subjective). 
Its response is created randomly in accepted or rejected. this will add a submission in the submission array with the is of the suer 
who has sumitted the question. This is a post request


### POST QUESTIONS "/questions" - This Allows Admins to create a question in the questions array. Normal users are not allowed to 
post a questions and will result in an error(403) Authorization error. this is a post request.


# To Be Continued...

