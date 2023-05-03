import express from 'express'
import { User, users } from '../db/users'
import {body, validationResult} from "express-validator"
import {admins} from '../db/admins'
import {sessions} from '../db/sessions'
import {uuidv4} from '../utils'
import {Route} from '.'

const SESSION_TIMEOUT = 24*60*60*1000 // 1 day

const userValidations = [
  body('email').isEmail(),
  body('password').isLength({min: 5}),
]
const profile: Route = {
  path: '/profile',
  handlers: [
    {
      isUserProtected: true,
      method: 'get',
      handlerFunc(req: express.Request, res: express.Response) {
        // cache the profile api response for 10 minutes
        res.set('Cache-Control', 'max-age=600')
        return res.send(sessions[req.cookies?.sessionId])
      }
    }
  ]
}

const userSignin: Route = {
  path: '/signin',
  handlers: [
    {
      validations: userValidations,
      method: "post",
      handlerFunc(req: express.Request<{}, {}, User>, res: express.Response) {
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
        res.cookie('email', email, {expires: new Date(Date.now() + SESSION_TIMEOUT)})
        res.cookie('isAdmin', false, {expires: new Date(Date.now() + SESSION_TIMEOUT)})
        res.send({
          msg: "Signed in"
        })

      },
    }
  ],
}

const adminSignin: Route = {
  path: '/signin/admin',
  handlers: [
    {
      method: 'post',
      validations: userValidations,
      handlerFunc(req: express.Request<{}, {}, User>, res: express.Response)  {
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
        res.cookie('email', admin.email, {expires: new Date(Date.now() + SESSION_TIMEOUT)})
        res.cookie('isAdmin', true, {expires: new Date(Date.now() + SESSION_TIMEOUT)})
        res.send({
          msg: "Signed in"
        })

      }
    }
  ]
}

const userSignup: Route = {
  path: '/signup',
  handlers: [
    {
      validations: userValidations,
      method: 'post',
      handlerFunc(req: express.Request<{}, {}, User>, res: express.Response) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).send({
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
    }
  ]
}

const adminSignup: Route = {
  path: '/signup/admin',
  handlers: [{
    method: 'post',
    handlerFunc(req: express.Request<{}, {}, User>, res: express.Response) {

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

  }]
}

const signout: Route = {
  path: '/signout',
  handlers: [
    {
      method: 'post',
      handlerFunc(req: express.Request, res: express.Response) {
        if (req.cookies?.sessionId) delete sessions[req.cookies?.sessionId]
        res.cookie('sessionId', '', {expires: new Date()})
        res.cookie('isAdmin', '', {expires: new Date()})
        res.cookie('email', '', {expires: new Date()})
        res.status(201).send()
      }
    }
  ]
}

export = [userSignin, adminSignin, userSignup, adminSignup, profile, signout]
