import { Component, DynamicModule, Global, Module } from '@nestjs/common'

@Component()
export class ConfigService {
  configure(config) {
   Object.keys(config).forEach((key) => {
     Reflect.defineProperty(this, key, {
       value: config[key]
     })
   })
  }
}

export function createConfigProvider(config) {
  return {
    provide: ConfigService,
    useFactory: () => {
      const configService = new ConfigService()

      configService.configure(config)

      return configService
    }
  }
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(config): DynamicModule {
    const providers = [createConfigProvider(config)]

    return {
      module: ConfigModule,
      components: providers,
      exports: providers
    }
  }
}
