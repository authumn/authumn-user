import * as glob from 'glob'
import * as path from 'path'
import { readSchema } from './readSchema'

export function loadSchemas(dir) {
  const files = glob.sync(
    path.resolve(
      dir,
      '*.json'
    )
  )

  return files.map(readSchema)
}
