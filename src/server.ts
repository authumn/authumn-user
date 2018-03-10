import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app/app.module';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { cors } from './app/common/cors'
import { environment } from './environments/environment'
import { HttpExceptionFilter } from './app/shared/filters/HttpExceptionFilter'

const pkg = require('../package.json')

const app: Promise<INestApplication> = NestFactory.create(ApplicationModule);
app.then(instance => {
  instance.use(cors)
  instance.useGlobalFilters(new HttpExceptionFilter());
  instance.listen(environment.port, () =>
    console.log(`${pkg.name} is listening on port ${environment.port}`)
  )
})
  .catch((error) => {
    console.error(error)
  })
