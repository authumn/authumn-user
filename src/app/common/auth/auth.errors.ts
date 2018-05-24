import { HttpStatus } from '@nestjs/common'
import { IErrorMessages } from '@nestling/errors'

export const authErrors: IErrorMessages = {
  type: 'auth',
  errors: [
    {
      code: 'unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Not authorized.'
    }
  ]
}
