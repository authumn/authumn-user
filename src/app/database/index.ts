import { Module } from '@nestjs/common';
import { mongoProvider } from '@nestling/mongodb'
import { redisProvider } from '@nestling/redis'

export const providers = [
  mongoProvider,
  redisProvider
]

@Module({
  exports: [
    ...providers
  ],
  providers
})
export class DatabaseModule {}
