import { Validator } from '@nestling/validator'
import { UniqueValidator } from './unique'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export const validators: Constructor<Validator>[] = [
  UniqueValidator
]
