import { Module } from '@nestjs/common';
import { mongoProvider } from '@nestling/mongodb'
import { redisProvider } from '@nestling/redis'

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
