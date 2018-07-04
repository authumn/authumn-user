import { Transport, ClientOptions } from '@nestjs/microservices'
import { join } from 'path'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(__dirname, './user.proto')
  }
}
