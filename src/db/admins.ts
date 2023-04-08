interface Admins {
  [key: string]: {
    email: string
    password: string
  }
}
export const admins: Admins = {
  'admin@admin.com': {
    email: 'admin@admin.com',
    password: 'admin123'
  }
}
