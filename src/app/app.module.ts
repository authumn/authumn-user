import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common'
import { UserModule } from './modules/user'
import { errorCodes } from './errors'
import { MessageCodeError } from './common/MessageCodeError'

MessageCodeError.addErrorCodes(errorCodes)

@Module({
  imports: [
    UserModule
  ]
})
export class ApplicationModule implements NestModule {
  configure (consumer: MiddlewaresConsumer): void {
  }
}
