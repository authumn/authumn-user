import { MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDbAdapter } from './adapter/mongo.adapter'

import { userErrors } from './user.errors'
import { AuthMiddleware } from '../../common/middleware/auth.middleware'
import { PasswordService } from './password.service'
import { MailService } from './mail.service'
import { DatabaseModule } from '../../database'
import { ErrorMessage } from '@nestling/errors'

import { ValidatorModule, loadSchemas } from '@nestling/validator'
import { mongoProvider } from '@nestling/mongodb'
import { validators } from '../../validators'

const schemas = loadSchemas(__dirname, '../../schemas')

ErrorMessage.addErrorMessages(userErrors)

@Module({
  imports: [
    DatabaseModule,
    ValidatorModule.forRoot({
      schemas,
      validators,
      inject: [
        mongoProvider
      ]
    }),
  ],
  controllers: [
    UserController
  ],
  components: [
    UserService,
    MailService,
    PasswordService,
    MongoDbAdapter
  ]
})
export class UserModule {
  configure(consumer: MiddlewaresConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/user/list', method: RequestMethod.GET },
      { path: '/user', method: RequestMethod.PUT },
      { path: '/user/:_id', method: RequestMethod.GET },
      { path: '/user/password', method: RequestMethod.POST }
    )
  }
}
