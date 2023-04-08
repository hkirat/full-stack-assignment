export enum languages {
  python = 'python',
  javaScript = "javaScript",
  golang = "golang",
  rust = "rust"
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
