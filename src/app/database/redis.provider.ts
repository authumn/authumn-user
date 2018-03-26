import * as Bluebird from 'bluebird'
import * as redis from 'redis'
import { ConfigService } from '@nestling/config'
import { LogService } from '@nestling/logger'

Bluebird.promisifyAll(redis.RedisClient.prototype)

export const redisProvider = {
  provide: 'RedisToken',

  useFactory: async (
    config: ConfigService,
    log: LogService
  ) => {
    const client = redis.createClient(
      config.redis.port,
      config.redis.host
    )

    client.on('connect', () => {
      log.info('Redis connected')
    })

    client.on('reconnecting', (delay, attempt) => {
      log.warn(`Lost connection: delay(${delay} attempt(${attempt}`)
    })

    client.on('error', (error) => {
      log.error(error)
    })

    return client
  },
  inject: [
    ConfigService,
    LogService
  ]
}
