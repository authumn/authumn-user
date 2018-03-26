import { MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import { ValidatorService } from '@nestling/validator'

import { userErrors } from './user.errors'
import { AuthMiddleware } from '../../common/middleware/auth.middleware'
import { PasswordService } from './password.service'
import { MailService } from './mail.service'
import { DatabaseModule } from '../../database'
import { ConfigModule, ConfigService } from '@nestling/config'
import { ErrorMessage } from '@nestling/errors'

ErrorMessage.addErrorMessages(userErrors)

@Module({
  imports: [
   // ConfigModule,
    DatabaseModule
  ],
  controllers: [
    UserController
  ],
  components: [
    UserService,
    MailService,
    PasswordService,
    ValidatorService,
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
