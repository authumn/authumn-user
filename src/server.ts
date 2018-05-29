import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app/app.module'
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface'
import { createCorsOptions } from './app/common/cors'
import { environment } from './environments/environment'

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

  instance.enableCors(createCorsOptions(config.whitelist))
  instance.listen(config.port, () =>
    console.info(`${pkg.name} is listening on port ${config.port}`)
  )
})
  .catch((error) => {
    console.error(error)
  })

