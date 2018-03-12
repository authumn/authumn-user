import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app/app.module'
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface'
import { createCorsOptions } from './app/common/cors'
import { HttpExceptionFilter } from './app/shared/filters/HttpExceptionFilter'
import { ConfigModule, ConfigService } from './app/modules/config'
import { environment } from './environments/environment'

const pkg = require('../package.json')

process.on('unhandledRejection', r => console.error(r))

const app: Promise<INestApplication> = NestFactory.create(ApplicationModule)

app.then(instance => {
  /* Not found..
  const config = instance
    .select(ConfigModule)
    .get(ConfigService)
  */
  const config = environment // FIXME

  const exceptionFilter = instance.get(HttpExceptionFilter)

  instance.enableCors(createCorsOptions(config.whitelist))
  instance.useGlobalFilters(exceptionFilter)
  instance.listen(config.port, () =>
    console.log(`${pkg.name} is listening on port ${config.port}`)
  )
})
  .catch((error) => {
    console.error(error)
  })

