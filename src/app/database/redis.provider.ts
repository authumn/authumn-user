import * as Bluebird from 'bluebird'
import * as redis from 'redis'
import { environment } from '../../environments/environment'

Bluebird.promisifyAll(redis.RedisClient.prototype)

export const redisProvider = {
  provide: 'RedisToken',

  useFactory: async () => {
    const client = redis.createClient(
      environment.redis.port,
      environment.redis.host
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
  }
}
