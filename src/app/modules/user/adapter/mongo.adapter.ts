import { IUserDbAdapter } from './IUserDbAdapter'
import { Injectable, Inject } from '@nestjs/common'
import { User } from '../models'
import { WriteOpResult } from 'mongodb'
import { ConfigService } from '@nestling/config'

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

  async insert({email, password}: User): Promise<User> {
    const user = {
      email,
      password
    }

    const collection = await this.db.collection('users')

    const result = await collection
      .insertOne(user)

    const updated = await this.findById(result.insertedId)

    return {
      _id: updated._id,
      email: updated.email
    }
  }

  async findById(id: string): Promise<User> {
    const collection = await this.db.collection('users')

    return collection.findOne({ _id: id })
  }

  async update(user: Partial<User>): Promise<User> {
    if (!user._id) {
      throw Error('Update requires user._id to be set')
    }
    const _user = await this.findById(user._id)

    const collection = await this.db.collection('users')

    const changes = {}

    Object.keys(user).forEach((key) => {
      if (_user[key] !== user[key]) {
        changes[key] = user[key]
      }
    })

    const result = await collection.update({ _id: user._id }, changes)

    delete result.password

    return result
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
