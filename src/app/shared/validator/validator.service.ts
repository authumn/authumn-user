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

    const ajv = setupAsync(new Ajv({
      schemas: this.schemas
    }))

    ajv.addKeyword(
      'idExists',
      {
        async: true,
        type: 'number',
        validate: this.idExists.bind(this)
      }
    )

    this.schemas.forEach((schema) => {
      this.validators[schema.$id] = ajv.getSchema(schema.$id)
    })
  }

  async validate(schema, data) {
    return this.validators[`${schema}.json`](data)
  }

  private async idExists(schema: boolean, data) {

  }

  private getValidator(schemaName) {
  }
}
