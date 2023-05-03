import express from 'express'
import {checkSchema, validationResult} from 'express-validator';
import {Route} from ".";
import {Difficulty, questions, Question} from "../db/questions";
import {users} from '../db/users';
import {uuidv4} from '../utils';

const questionSchema = checkSchema({
  title: {
    in: ['body'],
    isString: true,
    isLength: {
      options: {
        min: 3,
        max: 30
      }
    }
  },
  description: {
    in: ['body'],
    isString: true,
    optional: true
  },
  testcases: {
    in: ['body'],
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) throw new Error('testcases must be array')
        if (value.length === 0) throw new Error('testcases must not be empty')
        for (const v of value) {
          if (!v.input) throw new Error('input is required in testcase')
          if (!v.output) throw new Error('output is required in testcase')
        }
        return true
      }
    }
  }
})

const listAndCreateQuestion: Route = {
  path: '/questions',
  handlers: [
    {
      isUserProtected: true,
      method: 'get',
      handlerFunc(_: express.Request, res: express.Response) {
        return res.send({
          ...questions
        })
      }
    },
    {
      isAdminProtected: true,
      method: 'post',
      validations: questionSchema,
      handlerFunc(req: express.Request<{}, {}, Question>, res: express.Response) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(403).send({
            errors: errors.array()
          })
        }

        // add question
        const questionId = uuidv4()
        questions[questionId] = {
          title: req.body.title,
          testcases: req.body.testcases,
          acceptance: 0,
          difficulty: req.body.difficulty
        }
        if (req.body.description) questions[questionId].description = req.body.description

        res.status(201).send({
          msg: "added question"
        })

      }
    }
  ]
}

const detailQuestion: Route = {
  path: '/questions/:id',
  handlers: [
    {
      isUserProtected: true,
      method: 'get',
      handlerFunc(req: express.Request, res: express.Response) {
        const id = req.params.id
        if (!id || !questions[id]) return res.status(403).send({errors: [{msg: "Invalid question id"}]})
        const question = questions[id]
        return res.send({
          id,
          ...question
        })
      }
    },
  ]
}

export = [listAndCreateQuestion, detailQuestion]
