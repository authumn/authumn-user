let whitelist = [
  'http://localhost:4200',
  'http://authumn'
]

if (process.env.WHITELIST) {
  whitelist = process.env.WHITELIST.split(',')
    .map((str) => str.trim())
}

export const environment = {
  clientId: process.env.CLIENT_ID || 'authumn',
  port: process.env.PORT || 2302,
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost/specsh'
  },
  whitelist
}
