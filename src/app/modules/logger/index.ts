import * as Logger from 'bunyan'
import {
  Component,
  DynamicModule,
  Global,
  Module,
  Logger as CoreLogger,
  LoggerService as CoreLoggerService
} from '@nestjs/common'

@Component()
export class LogService extends Logger {}

export function createLoggerProvider(options) {
  return {
    provide: LogService,
    useFactory: () => new LogService(options)
  }
}
@Global()
@Module({})
export class LoggerModule {
  static forRoot(options): DynamicModule {
    const provider = createLoggerProvider(options)
    return {
      module: LoggerModule,
      components: [provider],
      exports: [provider]
    }
  }
}
