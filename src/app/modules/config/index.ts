import { Module } from '@nestjs/common'
import { environment } from '../../../environments/environment'

const configProvider = {
  provide: 'ConfigToken',
  useValue: environment,
};

@Module({
  components: [configProvider],
})
export class ConfigModule {}
