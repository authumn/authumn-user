import * as Ajv from 'ajv'
import * as setupAsync from 'ajv-async'
import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import { extensions } from './extensions'

const files = glob.sync(
  path.resolve(
    __dirname,
    '../schemas',
    '*.json'
  )
)

export function readSchema(file) {
  return JSON.parse(fs.readFileSync(
    file,
    'utf8'
  ))
}

const schemas = files.map(readSchema)

const ajv = setupAsync(new Ajv({
  schemas
}))

Object.keys(extensions).forEach((keyword) => {
  ajv.addKeyword(keyword, extensions[keyword)
})

export function getValidator(schemaName) {
  return ajv.getSchema(`${schemaName}.json`)
}
