import { MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import { databaseProviders } from '../../database/database.providers'
import { ValidatorService } from '../../shared/validator/validator.service'

import { userErrors } from './user.errors'
import { ErrorMessage } from '../../common/ErrorMessage'
import { AuthMiddleware } from '../../common/middleware/auth.middleware'
import { PasswordService } from './password.service'
import { MailService } from './mail.service'

ErrorMessage.addErrorMessages(userErrors)

@Module({
  imports: [
  ],
  controllers: [
    UserController
  ],
  components: [
    ...databaseProviders,
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
