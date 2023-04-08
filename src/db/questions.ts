export interface Testcase {
  input: any
  output: any
}
export interface Question {
  title: string
  description?: string
  testcases: Array<Testcase>
}
interface Questions {
  [key: string]: Question
}
export const questions: Questions = {
  '42fcded3-fae3-43cd-87d0-046ee41ce963': {
    title: `Reverse an array.`,
    testcases: [
      {
        input: [1,2,3,4],
        output: [4,3,2,1]
      }
    ]
  },
  '65029d65-67cb-4091-a9e2-d1e9bba1a979': {
    title: `Sum of an array`,
    testcases: [
      {
        input: [1,2,3,4],
        output: 11
      },
      {
        input: [2,3,4],
        output: 9
      }
    ]
  }
}
