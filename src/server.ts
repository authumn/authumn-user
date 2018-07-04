import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app/app.module'
import { createCorsOptions } from './app/common/cors'
import { environment } from './environments/environment'
import { grpcClientOptions } from './app/grpc-client-options'
import { ClientOptions } from '@nestjs/microservices'

const pkg = require('../package.json')

process.on('unhandledRejection', r => console.error(r))

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule)

  const config = environment // FIXME

  app.connectMicroservice({
    ...grpcClientOptions,
    options: {
      ...grpcClientOptions.options,
      url: `${config.grpc.host}:${config.grpc.port}`
    }
  } as ClientOptions)

  await app.startAllMicroservices()

  app.enableCors(createCorsOptions(config.whitelist))

  await app.listen(config.port)

  console.info(`${pkg.name} is listening at port ${config.port}`)
  console.info(`${pkg.name} grpc server is listening at ${config.grpc.host}:${config.grpc.port}`)
}

bootstrap()
