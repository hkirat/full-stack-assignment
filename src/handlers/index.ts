import express from 'express'
import {checkSchema, ValidationChain} from 'express-validator'
import auth from './auth'
import question from './question'
import submission from './submission'

export type HttpMethod = "get" | "put" | "post" | "patch" | "delete" | "head"

export interface Handler<Params=any, ResBody=any, ReqBody=any, ReqQuery=any> {
  method: HttpMethod
  isAdminProtected?: boolean
  isUserProtected?: boolean
  validations?: ReturnType<typeof checkSchema> | ValidationChain[]
  handlerFunc: (req: express.Request<Params, ReqBody, ResBody, ReqQuery>, res: express.Response) => void
}

export interface Route {
  path: string
  handlers: Handler[]
}

function bindRoutes(app: express.Express) {
  // could be automated to load all modules
  for (const entity of [
    auth,
    question,
    submission
  ]) {
    entity.forEach((route) => {
      route.handlers.forEach((handler) => {
        // bind route middleware
        if (handler.isAdminProtected) {
          app[handler.method](route.path, (req: express.Request, res:express.Response, next: express.NextFunction) => {
            if (req.isAdmin) return next()
            res.status(403).send({errors: [{msg: 'Only admin can access this'}]})
          })
          // app.use(route.path, (req: express.Request, res:express.Response, next: express.NextFunction) => {
          //   if (req.method.toLowerCase() !== handler.method || req.isAdmin) return next()
          //   res.status(403).send({errors: [{msg: 'Only admin can access this'}]})
          // })
        } else if (handler.isUserProtected) {
          app[handler.method](route.path, (req: express.Request, res:express.Response, next: express.NextFunction) => {
            if (req.isLoggedIn || req.method.toLowerCase() !== handler.method) {
              return next()
            } 
            res.status(403).send({errors: [{msg: 'User is not authenticated'}]})
          })
          // app.use(route.path, (req: express.Request, res:express.Response, next: express.NextFunction) => {
          //   if (req.isLoggedIn || req.method.toLowerCase() !== handler.method) {
          //     return next()
          //   } 
          //   res.status(403).send({errors: [{msg: 'User is not authenticated'}]})
          // })
        }

        if (handler.validations) {
          if ((handler.validations as ReturnType<typeof checkSchema>).run) {
            app[handler.method](route.path, handler.validations, handler.handlerFunc)
          } else {
            app[handler.method](route.path, ...handler.validations, handler.handlerFunc)
          }
        } else {
          app[handler.method](route.path, handler.handlerFunc)
        }
        console.log(`binding ${route.path} - ${handler.method.toUpperCase()}`)
      })
    })
  }
}
export default bindRoutes
