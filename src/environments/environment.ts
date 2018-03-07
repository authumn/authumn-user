const whitelist = [
  'http://localhost:4200',
  'http://authumn'
]

if (process.env.WHITELIST) {
  process.env.WHITELIST.split(',')
    .map((str) => str.trim())
}

export const environment = {
  clientId: process.env.CLIENT_ID || 'authumn',
  port: process.env.PORT || 2302,
  saltRounds: process.env.SALT_ROUNDS || 10,
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost/specsh'
  },
  whitelist
}
