import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common'
import { UserModule } from './modules/user'

@Module({
  imports: [
    UserModule
  ]
})
export class ApplicationModule implements NestModule {
  configure (consumer: MiddlewaresConsumer): void {
  }
}
