import { HttpStatus } from '@nestjs/common'
import { IErrorMessages } from '@nestling/errors'

export const userErrors: IErrorMessages = {
  type: 'user',
  errors: [
    {
      code: 'credentialsInvalid',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid Credentials.'
    },
    {
      code: 'emailAlreadyExist',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Email already exist.'
    },
    {
      code: 'notFound',
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Unable to find the user with the provided information.'
    }, {
      code: 'missingData',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Missing parameter data on the action.'
    }
  ]
}
