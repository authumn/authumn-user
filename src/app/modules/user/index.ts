import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import { databaseProviders } from '../../database/database.providers'

@Module({
  imports: [
  ],
  controllers: [
    UserController
  ],
  components: [
    ...databaseProviders,
    UserService,
    MongoDbAdapter
  ]

})
export class UserModule {}
