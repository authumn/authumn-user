import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestling/config'
import { Db } from 'mongodb'
import { Validator } from '@nestling/validator'

@Injectable()
export class UniqueValidator implements Validator {
  public keyword = 'unique'
  public async = true
  public type = 'string'
  public db: Db

  constructor(
    @Inject('MongoDbToken') readonly mongo,
    private config: ConfigService
  ) {
    this.db = mongo.db((this.config as any).mongo.database)
  }

  async validate(schema, data) {
    const collection = await this.db.collection(schema.collection)
    const result = await collection.findOne({ [schema.field]: data })

    return !Boolean(result)
  }
}
