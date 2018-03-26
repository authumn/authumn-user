let whitelist = [
  'http://localhost:4200',
  'http://authumn'
]

if (process.env.WHITELIST) {
  whitelist = process.env.WHITELIST.split(',')
    .map((str) => str.trim())
}

// TODO parse to int if number like
// parseInt(process.env.SALT_ROUNDS, 10) || 10,

export const environment = {
  client: {
    id: 'authumn'
  },
  port: 2302,
  saltRounds: 10,
  redis: {
    port: 6379,
    host: 'localhost',
    database: 1
  },
  mongo: {
    database: 'authumn-user',
    uri: 'mongodb://localhost/authumn-user'
  },
  jwt: {
    secret: 'change_me'
  },
  whitelist,
  mailer: {
    transport: {
      service: 'SendGrid',
      auth: {
        user: 'sendgrid_user',
        pass: 'sendgrid_pass'
      }
    },
    templates: {
      forgotPassword: {
        subject: 'Reset your password',
        text:
          'You are receiving this email because you (or someone else) have requested the reset of the password for your account\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          '{{reset_link}}\n\n' +
           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      },
      resetPassword: {
        subject: 'Your password has been changed',
        text:
          'Hello,\n\n' +
          'This is a confirmation that the password for your account has just been changed.'
      }
    }
  }
}
