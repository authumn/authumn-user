import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common'
import { UserModule } from './modules/user'
import { ConfigModule, ConfigService } from './modules/config'
import { environment } from '../environments/environment'
import { HttpExceptionFilter } from './shared/filters/HttpExceptionFilter'

@Module({
  imports: [
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
