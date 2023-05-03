export enum languages {
  python = 'python',
  js = "js",
  go = "go",
}
export enum submissionStatus {
  submitted = 'submitted',
  running = "running",
  failed = "failed",
  passed = "passed"
}

export interface Submission {
  questionId: string
  code: string
  language: languages
  status?: submissionStatus
}

interface Submissions {
  [key: string]: Submission
}
export const submissions: Submissions = {}
