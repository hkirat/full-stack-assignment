function filterSubmission(SUBMISSION, userId, questionIndex)
{
    let result = []
    SUBMISSION.find((submission)=>{
        if(questionIndex){
            if(submission.userId=== userId && submission.questionIndex === questionIndex)
                result.push(submission)  
        }
        else if(submission.userId=== userId)
                result.push(submission)
      })
      return result
}
module.exports = {filterSubmission}