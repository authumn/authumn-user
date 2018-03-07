import { IUserDbAdapter } from './IUserDbAdapter'
import { Component, Inject } from '@nestjs/common'
import { User } from '../models'

@Component()
export class MongoDbAdapter implements IUserDbAdapter {
  constructor(
    @Inject('MongoDbConnectionToken') private readonly mongo
  ) { }
  async find(by): Promise<User[]> {
    return this.mongo
      .collection('users')
      .find(by)
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

  async update({_id, email, password}: User): Promise<User> {
    const user = await this.findById(_id)

    console.log('updating', user)
    const collection = await this.mongo.collection('users')

    const result = await collection.update({ _id }, {
      email,
      password
    })

    return {
      _id: result._id,
      email: result.email
    }
  }

  async findAll(): Promise<User[]>  {
    return this.find({})
  }
}
