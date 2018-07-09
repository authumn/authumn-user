import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'

import { mongoProvider } from '@nestling/mongodb'
import { ErrorMessage } from '@nestling/errors'
import { ResponseMessage } from '@nestling/messages'
import { ValidatorModule, loadSchemas } from '@nestling/validator'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDbAdapter } from './adapter/mongo.adapter'

import { userErrors } from './user.errors'
import { PasswordService } from './password.service'
import { MailService } from './mail.service'
import { DatabaseModule } from '../../database'

import { validators } from '../../validators'
import { userMessages } from './user.messages'
import { UserServiceGogs } from './user.service.gogs'

const schemas = loadSchemas(__dirname, '../../schemas')

ErrorMessage.addErrorMessages(userErrors)
ResponseMessage.addResponseMessages(userMessages)

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
      provide: UserService,
      useClass: UserServiceGogs
    },
    MailService,
    PasswordService,
    MongoDbAdapter
  ]
})
export class UserModule {
  configure(_consumer: MiddlewareConsumer) {
  }
}
