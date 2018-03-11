import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import { databaseProviders } from '../../database/database.providers'
import { ValidatorService } from '../../shared/validator/validator.service'

import { userErrors } from './user.errors'
import { ErrorMessage } from '../../common/ErrorMessage'

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
    ValidatorService,
    MongoDbAdapter
  ]

})
export class UserModule {}
