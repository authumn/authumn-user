import { Module } from '@nestjs/common'

import { mongoProvider } from '@nestling/mongodb'
import { ErrorMessage } from '@nestling/errors'
import { ResponseMessage } from '@nestling/messages'
import { ValidatorModule, loadSchemas } from '@nestling/validator'

import { UserController } from './user.controller'
import { UserServiceMongo } from './services/user.service.mongo'
import { MongoDbAdapter } from './adapter/mongo.adapter'

import { userErrors } from './user.errors'
import { PasswordService } from './password.service'
import { MailService } from './mail.service'
import { DatabaseModule } from '../../database'

import { validators } from '../../validators'
import { userMessages } from './user.messages'
import { UserServiceGogs } from './services/user.service.gogs'
import {IUserService} from './interfaces/IUserService'
import {ConfigService} from '@nestling/config'

const schemas = loadSchemas(__dirname, '../../schemas')

ErrorMessage.addErrorMessages(userErrors)
ResponseMessage.addResponseMessages(userMessages)

const userServiceFactory = (
  config: ConfigService,
  adapter: MongoDbAdapter,
  passwordService: PasswordService
) => {
  if (config['provider'] === 'gogs.service') {
    return new UserServiceGogs(
      config,
    );
  } else if (config['provider'] === 'mongo.service') {
    return new UserServiceMongo(
      config,
      adapter,
      passwordService
    );
  }

  throw Error('Unknown User Service Provider')
};

@Module({
  imports: [
    DatabaseModule,
    ValidatorModule.forRoot({
      schemas,
      validators,
      inject: [
        mongoProvider
      ]
    })
  ],
  controllers: [
    UserController
  ],
  providers: [
    {
      provide: IUserService,
      useFactory: userServiceFactory
    },
    MailService,
    PasswordService,
    MongoDbAdapter
  ]
})
export class UserModule {}
