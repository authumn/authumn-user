import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestling/config'

@Injectable()
export class UniqueValidator {
  keyword = 'unique'
  async = true
  type = 'string'
  db
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
