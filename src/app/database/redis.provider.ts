import * as Bluebird from 'bluebird'
import * as redis from 'redis'
import { ConfigService } from '../modules/config'

Bluebird.promisifyAll(redis.RedisClient.prototype)

export const redisProvider = {
  provide: 'RedisToken',

  useFactory: async (
    config: ConfigService,
  ) => {
    const client = redis.createClient(
      config.redis.port,
      config.redis.host
    )

    client.on('connect', () => {
      console.log('Redis connected')
    })

    client.on('reconnecting', (delay, attempt) => {
      console.log(`Lost connection: delay(${delay} attempt(${attempt}`)
    })

    client.on('error', (error) => {
      console.error(error)
    })

    return client
  },
  inject: [ConfigService]
}
