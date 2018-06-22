import { IUserDbAdapter } from './IUserDbAdapter'
import { Injectable, Inject } from '@nestjs/common'
import { User } from '../models'
import { WriteOpResult } from 'mongodb'
import { ConfigService } from '@nestling/config'
import * as uuid from 'uuid'

@Injectable()
export class MongoDbAdapter implements IUserDbAdapter {
  db
  constructor(
    @Inject('MongoDbToken') readonly mongo,
    private config: ConfigService
  ) {
    this.db = mongo.db((this.config as any).mongo.database)
  }
  async find(by): Promise<User[]> {
    return this.db
      .collection('users')
      .find(by)
      .toArray()
  }

  async findOne(by): Promise<User> {
    return this.db
      .collection('users')
      .findOne(by)
  }

  async insert(user: User): Promise<User> {
    const collection = await this.db.collection('users')

    const id = uuid.v4()

    const result = await collection
      .insertOne({
        ...user,
        id
      }, {
        $currentDate: {
          created_at: true,
          updated_at: true
        }
      })

    const updated = await this.findById(id)

    return {
      id,
      email: updated.email,
      username: updated.username
    }
  }

  async findById(id: string): Promise<User> {
    const collection = await this.db.collection('users')

    return collection.findOne({ id })
  }

  async update(user: Partial<User>): Promise<User> {
    if (!user.id) {
      throw Error('Update requires user.id to be set')
    }
    const _user = await this.findById(user.id)

    const collection = await this.db.collection('users')

    const changes = {}

    Object.keys(user).forEach((key) => {
      if (
        _user[key] !== user[key] &&
        key !== '_id' &&
        key !== 'id'
      ) {
        changes[key] = user[key]
      }
    })

    const { result } = await collection.update({ id: user.id }, {
      $currentDate: {
        updated_at: true
      },
      $set: changes
    })

    if (result.ok) {
      return this.findById(user.id)
    }

    throw Error('Failed to update user.')
  }

  async findAll(): Promise<User[]>  {
    return this.find({})
  }

  async flush(): Promise<WriteOpResult>  {
    return this.db
      .collection('users')
      .remove({})
  }
}
