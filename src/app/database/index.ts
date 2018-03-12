import { Module } from '@nestjs/common';
import { mongoProvider } from './mongo.provider'
import { redisProvider } from './redis.provider'

export const databaseProviders = [
  mongoProvider,
  redisProvider
]

@Module({
  components: [
    ...databaseProviders
  ],
  exports: [
    ...databaseProviders
  ]
})
export class DatabaseModule {}
