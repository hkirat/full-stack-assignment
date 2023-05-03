import express from 'express'
import {checkSchema, validationResult} from "express-validator"
import {Route} from "."
import {questions} from '../db/questions'
import {languages, Submission, submissions, submissionStatus} from "../db/submissions"
import {runCode, uuidv4} from '../utils'


const submissionSchema = checkSchema({
  questionId: {
    in: ['params'],
    isUUID: true
  },
  code: {
    in: ['body'],
    isString: true,
  },
  language: {
    in: ['body'],
    isIn: {
      options: [Object.values(languages)]
    }
  }
})

const createAndListSubmission: Route = {
  path: '/questions/:questionId/submission',
  handlers: [
    {
      isUserProtected: true,
      method: 'post',
      validations: submissionSchema,
      handlerFunc(req: express.Request<{questionId: string}, {}, Omit<Submission, "questionId">>, res: express.Response) {
        const {language, code} = req.body
        const questionId = req.params.questionId

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(403).send({
            errors: errors.array()
          })
        }
        if (!questions[questionId]) return res.send({errors: [{msg: "invalid questionId"}]})
        const submissionId = uuidv4()
        submissions[submissionId] = {
          questionId,
          language: language,
          code: code,
          status: submissionStatus.submitted,
        }

        const testcases = questions[questionId].testcases
        const result = runCode(language, code, testcases)
        res.status(201).send({
            submissionId
        })
        // res.status(201).send({
        //   msg: result ? 'submission passed' : 'submissio failed'
        // })
      }
    }, 
    {
      isUserProtected: true,
      isAdminProtected: true,
      method: 'get',
      handlerFunc(_: express.Request, res: express.Response) {
        return res.send({
          submissions
        })
      }
    }
  ]
}

export = [createAndListSubmission]
