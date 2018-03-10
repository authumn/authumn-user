import { Component, Inject } from '@nestjs/common';
import * as Ajv from 'ajv'
import * as setupAsync from 'ajv-async'
import { loadSchemas } from './util/loadSchemas'
import * as path from 'path'

const schemaDir = path.resolve(__dirname, '../../schemas')

@Component()
export class ValidatorService {
  ajv
  schemas
  validators = {}
  constructor(
    @Inject('MongoDbConnectionToken') private readonly mongo
  ) {
    this.schemas = loadSchemas(schemaDir)
    const a = new Ajv({})

    a.addKeyword(
      'unique',
      {
        async: true,
        type: 'string',
        validate: this.unique.bind(this)
      }
    )

    const ajv = setupAsync(a)


    this.schemas.forEach((schema) => {
      this.validators[schema.$id] = ajv.compile(schema)
    })
  }

  async validate(schema, data) {
    return this.validators[`${schema}.json`](data)
  }

  private async unique(schema, data) {
    const collection = await this.mongo.collection(schema.collection)
    const result = await collection.findOne({ [schema.field]: data })

    return !Boolean(result)
  }
}
