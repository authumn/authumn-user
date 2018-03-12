import { MongoClient } from 'mongodb'
import { environment } from '../../environments/environment'

const {
  clientId,
  mongo: {
    url
  }
} = environment

const name = `${clientId}-user`

export const mongoProvider = {
  provide: 'MongoDbConnectionToken',
  useFactory: async () => {
    try {
      console.log('Connecting to:', url)
      const client = await MongoClient
        .connect(url)

      return client.db(name)
    } catch (error) {
      console.error(error)
      throw Error('Failed to connect')
    }
  }
}
