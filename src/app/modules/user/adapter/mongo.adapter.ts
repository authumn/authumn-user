import { IUserDbAdapter } from './IUserDbAdapter'
import { Component, Inject } from '@nestjs/common'
import { User } from '../models'
import { WriteOpResult } from 'mongodb'

@Component()
export class MongoDbAdapter implements IUserDbAdapter {
  constructor(
    @Inject('MongoDbToken') private readonly mongo
  ) { }
  async find(by): Promise<User[]> {
    return this.mongo
      .collection('users')
      .find(by)
      .toArray()
  }

  async findOne(by): Promise<User> {
    return this.mongo
      .collection('users')
      .findOne(by)
  }

  async insert({email, password}: User): Promise<User> {
    const user = {
      email,
      password
    }

    const collection = await this.mongo.collection('users')

    const result = await collection
      .insertOne(user)

    const updated = await this.findById(result.insertedId)

    return {
      _id: updated._id,
      email: updated.email
    }
  }

  async findById(id: string): Promise<User> {
    const collection = await this.mongo.collection('users')

    return collection.findOne({ _id: id })
  }

  async updateUser(user: Partial<User>): Promise<User> {
    const _user = await this.findById(user._id)

    const collection = await this.mongo.collection('users')

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
    return this.mongo
      .collection('users')
      .remove({})
  }
}
