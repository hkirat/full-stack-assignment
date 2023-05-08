interface Session {
  [key: string]: {
    email: string
    isAdmin: boolean
  }
}
export const sessions: Session = {}
