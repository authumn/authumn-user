import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ContextModule } from '@nestling/context'
import { UserModule } from './modules/user'
import { environment } from '../environments/environment'

import { ConfigModule } from '@nestling/config'
import { LoggerModule } from '@nestling/logger'
import {
  HttpExceptionFilter,
  validationErrorHandler,
  jsonWebTokenErrorHandler
} from '@nestling/errors'

HttpExceptionFilter.addExceptionHandler(validationErrorHandler)
HttpExceptionFilter.addExceptionHandler(jsonWebTokenErrorHandler)

@Module({
  imports: [
    ContextModule,
    LoggerModule.forRoot({
      name: environment.client.id
    }),
    ConfigModule.forRoot(environment, {
      prefix: process.env.OBJENV_PREFIX
    }),
    UserModule
  ]
})
export class ApplicationModule implements NestModule {
  configure (consumer: MiddlewareConsumer): void {
  }
}
