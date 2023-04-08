import express from 'express'
import cookieParser from 'cookie-parser'
import {body, checkSchema, validationResult} from 'express-validator'
import {admins} from './db/admins'
import {Question, questions} from './db/questions'
import {sessions} from './db/sessions'
import {languages, Submission, submissions, submissionStatus} from './db/submissions'
import { User, users } from './db/users'
import {runCode, uuidv4} from './utils'

const SESSION_TIMEOUT = 24*60*60*1000 // 1 day
const app = express()
const port = 9900

app.use(express.json())
app.use(cookieParser())

const userValidations = [
  body('email').isEmail(),
  body('password').isLength({min: 5}),
]

// parse cookie to check if user is logged in and user is admin on each request
app.use((req: express.Request, _, next: express.NextFunction) => {
  req.isLoggedIn = false
  req.isAdmin = false
  const sessionId = req.cookies?.sessionId as string
  if (!sessionId || !sessions[sessionId]) return next()

  req.isLoggedIn = true
  req.isAdmin = sessions[sessionId].isAdmin
  next()
})

app.use(/^\/questions\/?$/, (req: express.Request, res:express.Response, next: express.NextFunction) => {
  if (req.method === 'POST') {
    if (req.isAdmin && req.isLoggedIn) return next()
    res.status(403).send({
      errors: [
        {
          msg: "only admin access"
        }
      ]
    })
  } else if (req.method === 'GET' && req.isLoggedIn) {
    return next()
  } 
  res.status(403).send({errors: [{msg: 'not allowed'}]})
})

app.use(/^\/submissions\/?$/, (req: express.Request, res:express.Response, next: express.NextFunction) => {
  if (req.method === 'GET' && req.isLoggedIn) return next()
  res.status(403).send({errors: [{msg: 'not allowed'}]})
})
app.use('/questions/:quesionId', (req: express.Request, res:express.Response, next: express.NextFunction) => {
  if (req.method === 'POST') {
    if (req.isLoggedIn) return next()
    res.status(403).send({
      errors: [
        {
          msg: "login required"
        }
      ]
    })
  }
})

app.post('/signin',
  ...userValidations,
  (req: express.Request<{}, {}, User>, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(403).send({
        errors: errors.array()
      })
    }
    
    const email = req.body.email
    if (!users[email]) {
      res.status(404).send({
        errors: [
          {
            'msg': "User doesn't exist",
          }
        ]
      })
      return
    }

    // check password
    const result = users[req.body.email]
    if (result.password !== req.body.password) {
      return res.status(403).send({errors: [{msg: 'invalid email/password'}]})
    }

    // set session and return sessionId
    const sessionId = uuidv4()
    sessions[sessionId] = {
      email: req.body.email,
      isAdmin: false
    }

    res.cookie('sessionId', sessionId, {expires: new Date(Date.now() + SESSION_TIMEOUT)})
    res.send({
      msg: "Signed in"
    })
  }
)

app.post('/signup',
  ...userValidations,
  (req: express.Request<{}, {}, User>, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send({
        errors: errors.array()
      })
    }

    const email = req.body.email
    if (users[email]) {
      res.status(404).send({
        errors: [
          {
            'msg': "User already exists",
          }
        ]
      })
      return
    }
    users[email] = {
      email,
      password: req.body.password
    }
    
    res.send({
      msg: "Signed up"
    })
  }
)

app.post(
  '/signup/admin',
  ...userValidations,
  (req: express.Request<{}, {}, User>, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send({
        errors: errors.array()
      })
    }

    const email = req.body.email
    if (admins[email]) {
      res.status(404).send({
        errors: [
          {
            'msg': "Admin already exists",
          }
        ]
      })
      return
    }
    admins[email] = {
      email,
      password: req.body.password
    }
    
    res.send({
      msg: "Signed up"
    })
  }
)

app.post('/signin/admin',
  ...userValidations,
  (req: express.Request<{}, {}, User>, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(403).send({
        errors: errors.array()
      })
    }
    
    const email = req.body.email
    if (!admins[email]) {
      res.status(404).send({
        errors: [
          {
            'msg': "Admin doesn't exist",
          }
        ]
      })
      return
    }

    // check password
    const admin = admins[req.body.email]
    if (admin.password !== req.body.password) {
      return res.status(403).send({errors: [{msg: 'invalid email/password'}]})
    }

    // set session and return sessionId
    const sessionId = uuidv4()
    sessions[sessionId] = {
      email: req.body.email,
      isAdmin: true
    }
    res.cookie('sessionId', sessionId, {expires: new Date(Date.now() + SESSION_TIMEOUT)})
    res.send({
      msg: "Signed in"
    })
  }
)

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
app.post('/questions',
  questionSchema,
  (req: express.Request<{}, {}, Question>, res: express.Response) => {
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
      testcases: req.body.testcases
    }
    if (req.body.description) questions[questionId].description = req.body.description

    res.status(201).send({
      msg: "added question"
    })
  }
)

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

app.post(
  '/questions/:questionId',
  submissionSchema,
  (req: express.Request<{questionId: string}, {}, Submission>, res: express.Response) => {
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
      msg: result ? 'submission passed' : 'submissio failed'
    })
  }
)

app.get('/questions', 
  (req: express.Request, res: express.Response) => {
    return res.send({
      questions
    })
  }
)

app.get('/submissions', 
  (req: express.Request, res: express.Response) => {
    return res.send({
      submissions
    })
  }
)

app.listen(port, 'localhost', () => {
  console.log(`Leetcode lite app listening on port ${port}`)
})

