import { HttpStatus } from '@nestjs/common'
import { IErrorMessages } from '../../common/ErrorMessage'

export const userErrors: IErrorMessages = {
  type: 'user',
  errors: [
    {
      name: 'credentialsInvalid',
      httpStatus: HttpStatus.BAD_REQUEST,
      message: 'Invalid Credentials.'
    },
    {
      name: 'emailAlreadyExist',
      httpStatus: HttpStatus.BAD_REQUEST,
      message: 'Email already exist.'
    },
    {
      name: 'user:notFound',
      httpStatus: HttpStatus.NOT_FOUND,
      message: 'Unable to find the user with the provided information.'
    }, {
      name: 'action:missingData',
      httpStatus: HttpStatus.BAD_REQUEST,
      message: 'Missing parameter data on the action.'
    }
  ]
}
