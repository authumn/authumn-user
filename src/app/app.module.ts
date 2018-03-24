import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common'
import { UserModule } from './modules/user'
import { ConfigModule, ConfigService } from './modules/config'
import { environment } from '../environments/environment'

import { LoggerModule } from './modules/logger'
import { HttpExceptionFilter } from '@nestling/errors'

@Module({
  imports: [
    LoggerModule.forRoot({
      name: environment.client.id
    }),
    ConfigModule.forRoot(environment),
    UserModule,
  ],
  components: [
    HttpExceptionFilter
  ]
})
export class ApplicationModule implements NestModule {
  configure (consumer: MiddlewaresConsumer): void {
  }
}
