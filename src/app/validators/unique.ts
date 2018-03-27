import { Component, Inject } from '@nestjs/common'

@Component()
export class UniqueValidator {
  keyword = 'unique'
  async = true
  type = 'string'
  constructor(
    @Inject('MongoDbToken') private readonly mongo
  ) {}

  async validate(schema, data) {
    const collection = await this.mongo.collection(schema.collection)
    const result = await collection.findOne({ [schema.field]: data })

    return !Boolean(result)
  }
}
