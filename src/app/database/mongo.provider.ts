import { MongoClient } from 'mongodb'
import { ConfigService } from '../modules/config'
import { LogService } from '../modules/logger'

export const mongoProvider = {
  provide: 'MongoDbConnectionToken',
  useFactory: async (
    config: ConfigService,
    logger: LogService
  ) => {
    const {
      clientId,
      mongo: {
        url
      }
    } = config

    const name = `${clientId}-user`

    try {
      logger.info(`Connecting to: ${url}`)
      const client = await MongoClient
        .connect(url)

      return client.db(name)
    } catch (error) {
      console.error(error)
      throw Error('Failed to connect')
    }
  },
  inject: [
    ConfigService,
    LogService
  ]
}
