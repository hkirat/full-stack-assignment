import express from 'express'
import cookieParser from 'cookie-parser'
import {sessions} from './db/sessions'
import cors from 'cors';
import bindRoutes from './handlers'

const app = express()
const port = 9900

app.use(express.json())
app.use(cookieParser())
// app.use(cors())
app.use(cors({
  // origin: /^http[s]?:\/\/localhost\:?\d{4}$/
  origin:/.*/,
  credentials: true
  // origin: true
}))


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

bindRoutes(app)

app.listen(port, 'localhost', () => {
  console.log(`Leetcode lite app listening on port ${port}`)
})

