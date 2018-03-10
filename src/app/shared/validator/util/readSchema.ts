import * as fs from 'fs'

export function readSchema(file) {
  return JSON.parse(fs.readFileSync(
    file,
    'utf8'
  ))
}
