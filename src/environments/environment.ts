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
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    database: process.env.REDIS_DATABASE || 1
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost/authumn-user'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me'
  },
  whitelist,
  mailer: {
    transport: {
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
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
