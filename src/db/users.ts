export interface User {
  email: string
  password: string
}

interface Users {
  [key: string]: User
}
export const users: Users =  {}
