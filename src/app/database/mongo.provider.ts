import { MongoClient } from 'mongodb'

export const mongoProvider = {
  provide: 'MongoDbConnectionToken',
  useFactory: async (config) => {
    const {
      clientId,
      mongo: {
        url
      }
    } = config

    const name = `${clientId}-user`

    try {
      console.log('Connecting to:', url)
      const client = await MongoClient
        .connect(url)

      return client.db(name)
    } catch (error) {
      console.error(error)
      throw Error('Failed to connect')
    }
  },
  inject: ['ConfigToken']
}
