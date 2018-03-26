import { Module, NestModule, MiddlewaresConsumer, Component, Inject } from '@nestjs/common'
import { UserModule } from './modules/user'
import { environment } from '../environments/environment'

import { ConfigModule } from '@nestling/config'
import { LoggerModule } from '@nestling/logger'
import { ValidatorModule, loadSchemas } from '@nestling/validator'
import { HttpExceptionFilter } from '@nestling/errors'
import * as Ajv from 'ajv'
import { mongoProvider } from '@nestling/mongodb'

const schemas = loadSchemas(__dirname, './schemas')

@Component()
export class UniqueValidator {
  keyword = 'unique'
  async: true
  type: 'string'
  constructor(
    @Inject('MongoDbToken') private readonly mongo
  ) {}

  private async validate(schema, data) {
    const collection = await this.mongo.collection(schema.collection)
    const result = await collection.findOne({ [schema.field]: data })

    return !Boolean(result)
  }
}

const validators = [
  UniqueValidator
]

@Module({
  imports: [
    LoggerModule.forRoot({
      name: environment.client.id
    }),
    ConfigModule.forRoot(environment, {
      prefix: process.env.OBJENV_PREFIX
    }),
    ValidatorModule.forRoot({
      schemas,
      validators,
      inject: [
        mongoProvider
      ]
    }),
    UserModule
  ],
  components: [
    HttpExceptionFilter
  ]
})
export class ApplicationModule implements NestModule {
  configure (consumer: MiddlewaresConsumer): void {
  }
}
