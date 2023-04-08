import { v4 as uuidv4 } from 'uuid'
import {Testcase} from './db/questions'
import {languages} from './db/submissions'

function runCode(language: languages, code: string, testCases: Testcase[]) {
  // offload to a pipeline in the next iteration, dummy response for now
  return Date.now()%2 === 0 // randomly return true or false fow now
}

export {
  uuidv4,
  runCode
}
