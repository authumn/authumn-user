import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app/app.module'
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface'
import { createCorsOptions } from './app/common/cors'
import { ConfigModule, ConfigService } from '@nestling/config'
import { environment } from './environments/environment'
import { LoggerModule, LogService } from '@nestling/logger'
import { HttpExceptionFilter } from '@nestling/errors'

const pkg = require('../package.json')

process.on('unhandledRejection', r => console.error(r))

const app: Promise<INestApplication> = NestFactory.create(ApplicationModule)

app.then(instance => {
  /* Not found..
  const config = instance
    .select(ConfigModule)
    .get(ConfigService)
  const log = instance
    .get(LogService)
  */
  const config = environment // FIXME

  const exceptionFilter = instance.get(HttpExceptionFilter)

  instance.enableCors(createCorsOptions(config.whitelist))
  instance.useGlobalFilters(exceptionFilter)
  instance.listen(config.port, () =>
    console.info(`${pkg.name} is listening on port ${config.port}`)
  )
})
  .catch((error) => {
    console.error(error)
  })

