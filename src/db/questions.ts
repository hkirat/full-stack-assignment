export interface Testcase {
  input: any
  output: any
}

export enum Difficulty {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard'
}
export interface Question {
  id?: string
  title: string
  description?: string
  acceptance: number
  difficulty: Difficulty
  testcases: Array<Testcase>
}
interface Questions {
  [key: string]: Question
}
export const questions: Questions = {
  '42fcded3-fae3-43cd-87d0-046ee41ce963': {
    title: `Reverse an array.`,
    description: `Reverse an array`,
    acceptance: 74,
    testcases: [
      {
        input: [1,2,3,4],
        output: [4,3,2,1]
      }
    ],
    difficulty: Difficulty.hard
  },
  '65029d65-67cb-4091-a9e2-d1e9bba1a979': {
    title: `Sum of an array`,
    description: `You hi bewa`,
    acceptance: 42,
    testcases: [
      {
        input: [1,2,3,4],
        output: 11
      },
      {
        input: [2,3,4],
        output: 9
      }
    ],
    difficulty: Difficulty.medium
  }
}
